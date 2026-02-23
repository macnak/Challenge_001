import type { ChallengeContext } from './types.js';
import { pick, randomInt, randomString } from './utils.js';
import { runConfig } from '../config.js';

type ProductRow = {
  guid: string;
  sku: string;
  name: string;
  category: string;
  priceCents: number;
  stock: number;
  rating: number;
};

type ApiTableTargetRule =
  | {
      mode: 'sku';
      sku: string;
      instruction: string;
    }
  | {
      mode: 'compound';
      category: string;
      metric: 'stock';
      order: 'desc';
      instruction: string;
    }
  | {
      mode: 'rating-under-cap';
      priceCapCents: number;
      metric: 'rating';
      order: 'desc';
      instruction: string;
    };

type ApiTableRuleMode = ApiTableTargetRule['mode'];

const parseRuleMode = (value: string | undefined): ApiTableRuleMode | null => {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase().replace(/_/g, '-').trim();
  return ['sku', 'compound', 'rating-under-cap'].includes(normalized)
    ? (normalized as ApiTableRuleMode)
    : null;
};

const parseRuleSequence = (value: string | undefined): ApiTableRuleMode[] => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((part) => parseRuleMode(part))
    .filter((mode): mode is ApiTableRuleMode => mode !== null);
};

const categories = ['Electronics', 'Books', 'Home', 'Fitness', 'Garden', 'Office'];
const names = [
  'Nova Lamp',
  'Flux Keyboard',
  'Orbit Bottle',
  'Pulse Headset',
  'Aero Chair',
  'Delta Notebook',
  'Echo Router',
  'Vector Mouse',
  'Prism Monitor',
  'Atlas Bag',
];

const makeGuid = (context: ChallengeContext) => {
  const a = randomString(8, context.rng);
  const b = randomString(4, context.rng);
  const c = randomString(4, context.rng);
  const d = randomString(4, context.rng);
  const e = randomString(12, context.rng);
  return `${a}-${b}-${c}-${d}-${e}`;
};

const formatPrice = (priceCents: number) => {
  const value = (priceCents / 100).toFixed(2);
  return `$${value}`;
};

export const resolveApiTableRuleMode = (
  context: ChallengeContext,
  options?: {
    forcedMode?: ApiTableRuleMode | null;
    sequence?: ApiTableRuleMode[];
  },
): ApiTableRuleMode => {
  const envForcedMode = parseRuleMode(process.env.API_TABLE_RULE_MODE);
  const envSequence = parseRuleSequence(process.env.API_TABLE_RULE_SEQUENCE);
  const hasForcedModeOption = options !== undefined && 'forcedMode' in options;
  const hasSequenceOption = options !== undefined && 'sequence' in options;

  const forcedMode = hasForcedModeOption
    ? (options.forcedMode ?? null)
    : hasSequenceOption
      ? null
      : (envForcedMode ?? runConfig.apiTableRuleMode);
  const sequence = hasSequenceOption
    ? (options.sequence ?? [])
    : envSequence.length > 0
      ? envSequence
      : runConfig.apiTableRuleSequence;

  if (forcedMode) {
    return forcedMode;
  }

  if (sequence.length > 0) {
    const idx = Math.max(0, context.index - 1) % sequence.length;
    return sequence[idx];
  }

  return pick(['sku', 'compound', 'rating-under-cap'] as const, context.rng);
};

export const generateApiTableGuid = (context: ChallengeContext) => {
  const count = randomInt(5, 20, context.rng);
  const products: ProductRow[] = Array.from({ length: count }, () => {
    const name = pick(names, context.rng);
    const category = pick(categories, context.rng);
    const sku = `${category.slice(0, 3).toUpperCase()}-${randomInt(1000, 9999, context.rng)}`;
    return {
      guid: makeGuid(context),
      sku,
      name,
      category,
      priceCents: randomInt(999, 24999, context.rng),
      stock: randomInt(0, 250, context.rng),
      rating: randomInt(10, 50, context.rng) / 10,
    };
  });

  const targetIndex = randomInt(0, products.length - 1, context.rng);
  const target = products[targetIndex];
  const mode = resolveApiTableRuleMode(context);

  let targetRule: ApiTableTargetRule;
  if (mode === 'compound') {
    const category = target.category;
    const currentCategoryMax = products
      .filter((product) => product.category === category)
      .reduce((max, product) => Math.max(max, product.stock), 0);
    target.stock = currentCategoryMax + randomInt(1, 25, context.rng);

    targetRule = {
      mode: 'compound',
      category,
      metric: 'stock',
      order: 'desc',
      instruction: `Find the product in category ${category} with the highest stock and submit its guid.`,
    };
  } else if (mode === 'rating-under-cap') {
    const priceCapCents = Math.min(29999, target.priceCents + randomInt(500, 3500, context.rng));
    target.rating = 5.0;

    for (let i = 0; i < products.length; i += 1) {
      const product = products[i];
      if (product.guid !== target.guid && product.priceCents <= priceCapCents) {
        product.rating = Math.min(product.rating, 4.9);
      }
    }

    targetRule = {
      mode: 'rating-under-cap',
      priceCapCents,
      metric: 'rating',
      order: 'desc',
      instruction: `Find the product with the highest rating where price is <= ${formatPrice(priceCapCents)} and submit its guid.`,
    };
  } else {
    targetRule = {
      mode: 'sku',
      sku: target.sku,
      instruction: `Find the row where SKU = ${target.sku} and submit its guid.`,
    };
  }

  return {
    products,
    targetGuid: target.guid,
    targetRule,
  };
};

export const renderApiTableGuid = (
  context: ChallengeContext,
  data: { targetRule: ApiTableTargetRule },
) => {
  const dataPath = `/m/${context.session.accessMethod}/challenge/${context.index}/data`;
  return `
    <h1>Challenge ${context.index}: API Table Selection</h1>
    <p class="muted">The table is loaded from an API call.</p>
    <p class="muted"><strong>${data.targetRule.instruction}</strong></p>
    <table style="width:100%; border-collapse: collapse; margin: 12px 0; font-size: 0.95rem;">
      <thead>
        <tr>
          <th style="text-align:left; padding:8px; border-bottom:1px solid rgba(255,255,255,0.2);">SKU</th>
          <th style="text-align:left; padding:8px; border-bottom:1px solid rgba(255,255,255,0.2);">Name</th>
          <th style="text-align:left; padding:8px; border-bottom:1px solid rgba(255,255,255,0.2);">Category</th>
          <th style="text-align:left; padding:8px; border-bottom:1px solid rgba(255,255,255,0.2);">Price</th>
          <th style="text-align:left; padding:8px; border-bottom:1px solid rgba(255,255,255,0.2);">Stock</th>
          <th style="text-align:left; padding:8px; border-bottom:1px solid rgba(255,255,255,0.2);">Rating</th>
        </tr>
      </thead>
      <tbody id="productsBody">
        <tr><td colspan="6" class="muted" style="padding:10px;">Loading data...</td></tr>
      </tbody>
    </table>
    <label class="muted" for="answer">Target GUID</label>
    <input id="answer" name="answer" type="text" autocomplete="off" />
    <script>
      (function(){
        const params = new URLSearchParams(window.location.search);
        const token = params.get('t') || '';
        const endpoint = token ? '${dataPath}?t=' + encodeURIComponent(token) : '${dataPath}';
        const body = document.getElementById('productsBody');

        fetch(endpoint, { headers: { 'Accept': 'application/json' } })
          .then(function(response){
            if (!response.ok) {
              throw new Error('Failed to load products');
            }
            return response.json();
          })
          .then(function(payload){
            if (!body || !payload || !Array.isArray(payload.products)) {
              return;
            }

            body.innerHTML = payload.products.map(function(product){
              const price = '$' + (Number(product.priceCents || 0) / 100).toFixed(2);
              return '<tr>' +
                '<td style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.08);">' + product.sku + '</td>' +
                '<td style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.08);">' + product.name + '</td>' +
                '<td style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.08);">' + product.category + '</td>' +
                '<td style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.08);">' + price + '</td>' +
                '<td style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.08);">' + String(product.stock) + '</td>' +
                '<td style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.08);">' + String(product.rating) + '</td>' +
              '</tr>';
            }).join('');
          })
          .catch(function(){
            if (body) {
              body.innerHTML = '<tr><td colspan="6" class="muted" style="padding:10px;">Could not load product data.</td></tr>';
            }
          });
      })();
    </script>
  `;
};

export const buildApiTablePayload = (data: {
  products: ProductRow[];
  targetRule: ApiTableTargetRule;
}) => {
  return {
    target: data.targetRule,
    products: data.products,
  };
};

export const validateApiTableGuid = (
  data: { targetGuid: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.targetGuid;
};

export { formatPrice };
export type { ApiTableTargetRule };
