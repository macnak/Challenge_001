import type { ChallengeContext } from './types.js';
import type { ChallengeRuntime } from './engine.js';
import {
  generateWhitespaceToken,
  renderWhitespaceToken,
  validateWhitespaceToken,
} from './whitespaceToken.js';
import {
  generateSortingSingle,
  renderSortingSingle,
  validateSortingSingle,
} from './sortingSingle.js';
import {
  generateRadioCheckbox,
  renderRadioCheckbox,
  validateRadioCheckbox,
} from './radioCheckbox.js';
import {
  generateHeaderDerived,
  renderHeaderDerived,
  validateHeaderDerived,
} from './headerDerived.js';
import { generateSortingMulti, renderSortingMulti, validateSortingMulti } from './sortingMulti.js';
import {
  generateHiddenFieldMetadata,
  renderHiddenFieldMetadata,
  validateHiddenFieldMetadata,
} from './hiddenFieldMetadata.js';
import {
  generateFixedFormBasicFields,
  renderFixedFormBasicFields,
  validateFixedFormBasicFields,
} from './fixedFormBasicFields.js';
import {
  generateFixedFormSelectRadio,
  renderFixedFormSelectRadio,
  validateFixedFormSelectRadio,
} from './fixedFormSelectRadio.js';
import {
  generateFormPreSubmitEncoding,
  renderFormPreSubmitEncoding,
  validateFormPreSubmitEncoding,
} from './formPreSubmitEncoding.js';
import {
  generateFixedFormDateMulti,
  renderFixedFormDateMulti,
  validateFixedFormDateMulti,
} from './fixedFormDateMulti.js';
import {
  generateFixedFormVisualControls,
  renderFixedFormVisualControls,
  validateFixedFormVisualControls,
} from './fixedFormVisualControls.js';
import {
  generateAuthCookieBoot,
  renderAuthCookieBoot,
  validateAuthCookieBoot,
} from './authCookieBoot.js';
import {
  generateAuthHeaderSwitch,
  renderAuthHeaderSwitch,
  validateAuthHeaderSwitch,
} from './authHeaderSwitch.js';
import {
  generateJwtLiteClaims,
  renderJwtLiteClaims,
  validateJwtLiteClaims,
} from './jwtLiteClaims.js';
import {
  generateOauthPkceMini,
  renderOauthPkceMini,
  validateOauthPkceMini,
} from './oauthPkceMini.js';
import {
  generateRefreshRotation,
  renderRefreshRotation,
  validateRefreshRotation,
} from './refreshRotation.js';
import {
  generateCsrfDoubleSubmit,
  renderCsrfDoubleSubmit,
  validateCsrfDoubleSubmit,
} from './csrfDoubleSubmit.js';
import {
  generateNonceLoginWindow,
  renderNonceLoginWindow,
  validateNonceLoginWindow,
} from './nonceLoginWindow.js';
import {
  generateRedirectStateHop,
  renderRedirectStateHop,
  validateRedirectStateHop,
} from './redirectStateHop.js';
import {
  generateRedirectTokenPickupBasic,
  renderRedirectTokenPickupBasic,
  validateRedirectTokenPickupBasic,
} from './redirectTokenPickupBasic.js';
import {
  generateRedirectTokenBranching,
  renderRedirectTokenBranching,
  validateRedirectTokenBranching,
} from './redirectTokenBranching.js';
import {
  generatePageTimeoutIdle,
  renderPageTimeoutIdle,
  validatePageTimeoutIdle,
} from './pageTimeoutIdle.js';
import {
  generatePageTimeoutStepWindow,
  renderPageTimeoutStepWindow,
  validatePageTimeoutStepWindow,
} from './pageTimeoutStepWindow.js';
import {
  generateSamlRedirectLite,
  renderSamlRedirectLite,
  validateSamlRedirectLite,
} from './samlRedirectLite.js';
import { generateSamlPostLite, renderSamlPostLite, validateSamlPostLite } from './samlPostLite.js';
import {
  generateStepupMfaSequence,
  renderStepupMfaSequence,
  validateStepupMfaSequence,
} from './stepupMfaSequence.js';
import {
  generateOnePageAuthWizard,
  renderOnePageAuthWizard,
  validateOnePageAuthWizard,
} from './onePageAuthWizard.js';
import {
  generateTabbedFormProgressive,
  renderTabbedFormProgressive,
  validateTabbedFormProgressive,
} from './tabbedFormProgressive.js';
import {
  generatePaginationSequentialPick,
  renderPaginationSequentialPick,
  validatePaginationSequentialPick,
} from './paginationSequentialPick.js';
import {
  generatePaginationFilterThenPick,
  renderPaginationFilterThenPick,
  validatePaginationFilterThenPick,
} from './paginationFilterThenPick.js';
import {
  generateMenuClickBasic,
  renderMenuClickBasic,
  validateMenuClickBasic,
} from './menuClickBasic.js';
import {
  generateMenuHoverDelay,
  renderMenuHoverDelay,
  validateMenuHoverDelay,
} from './menuHoverDelay.js';
import {
  generateMenuSubmenuPath,
  renderMenuSubmenuPath,
  validateMenuSubmenuPath,
} from './menuSubmenuPath.js';
import {
  generateMenuThemeVariant,
  renderMenuThemeVariant,
  validateMenuThemeVariant,
} from './menuThemeVariant.js';
import {
  generateFioriTableIdPattern,
  renderFioriTableIdPattern,
  validateFioriTableIdPattern,
} from './fioriTableIdPattern.js';
import {
  generateFioriTableCompoundSelector,
  renderFioriTableCompoundSelector,
  validateFioriTableCompoundSelector,
} from './fioriTableCompoundSelector.js';
import {
  generateTabbedFormConditional,
  renderTabbedFormConditional,
  validateTabbedFormConditional,
} from './tabbedFormConditional.js';
import {
  generateHiddenFieldMetadataAuto,
  renderHiddenFieldMetadataAuto,
  validateHiddenFieldMetadataAuto,
} from './hiddenFieldMetadataAuto.js';
import {
  generateTokenAssembly,
  renderTokenAssembly,
  validateTokenAssembly,
} from './tokenAssembly.js';
import { generateTimingWindow, renderTimingWindow, validateTimingWindow } from './timingWindow.js';
import {
  generateRequestIntegrity,
  renderRequestIntegrity,
  validateRequestIntegrity,
} from './requestIntegrity.js';
import { generateAutoFilledJs, renderAutoFilledJs, validateAutoFilledJs } from './autoFilledJs.js';
import { generateSseDelivered, renderSseDelivered, validateSseDelivered } from './sseDelivered.js';
import { generateWsDelivered, renderWsDelivered, validateWsDelivered } from './wsDelivered.js';
import { generateDomShuffling, renderDomShuffling, validateDomShuffling } from './domShuffling.js';
import { generateShadowCanvas, renderShadowCanvas, validateShadowCanvas } from './shadowCanvas.js';
import { generateDecoyInputs, renderDecoyInputs, validateDecoyInputs } from './decoyInputs.js';
import {
  generateSelectorVariant,
  renderSelectorVariant,
  validateSelectorVariant,
} from './selectorVariant.js';
import {
  generateDownloadedFilePlain,
  renderDownloadedFilePlain,
  validateDownloadedFilePlain,
} from './downloadedFilePlain.js';
import {
  generateDownloadedFileEncoded,
  renderDownloadedFileEncoded,
  validateDownloadedFileEncoded,
} from './downloadedFileEncoded.js';
import {
  generateCreateUploadFile,
  renderCreateUploadFile,
  validateCreateUploadFile,
} from './createUploadFile.js';
import { generateApiTableGuid, renderApiTableGuid, validateApiTableGuid } from './apiTableGuid.js';
import {
  generateLargePoolSelection,
  renderLargePoolSelection,
  validateLargePoolSelection,
} from './largePoolSelection.js';
import {
  generateWordOrderPosition,
  renderWordOrderPosition,
  validateWordOrderPosition,
} from './wordOrderPosition.js';
import {
  generateMarkdownPdfUpload,
  renderMarkdownPdfUpload,
  validateMarkdownPdfUpload,
} from './markdownPdfUpload.js';

const placeholderValidate = () => false;

export const challengeRuntimes: ChallengeRuntime[] = [
  {
    id: 'whitespace-token',
    title: 'Whitespace Token',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Extract the token hidden in whitespace and submit it trimmed.',
    render: (context: ChallengeContext, state) =>
      renderWhitespaceToken(context, state as { display: string }),
    generate: (context) => generateWhitespaceToken(context),
    validate: (_context, state, payload) =>
      validateWhitespaceToken(state as { token: string }, payload),
  },
  {
    id: 'sorting-single',
    title: 'Sorting Rule (Single Input)',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Sort the numbers as instructed and submit them using the required delimiter.',
    render: (context: ChallengeContext, state) =>
      renderSortingSingle(
        context,
        state as { display: number[]; order: string; delimiter: string },
      ),
    generate: (context) => generateSortingSingle(context),
    validate: (_context, state, payload) =>
      validateSortingSingle(
        state as { numbers: number[]; order: string; delimiter: string },
        payload,
      ),
  },
  {
    id: 'sorting-multi',
    title: 'Sorting Rule (Multi Input)',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Order the numbers correctly and enter the sequence across the multiple inputs.',
    render: (context: ChallengeContext, state) =>
      renderSortingMulti(context, state as { display: number[]; order: string }),
    generate: (context) => generateSortingMulti(context),
    validate: (_context, state, payload) =>
      validateSortingMulti(state as { numbers: number[]; order: string }, payload),
  },
  {
    id: 'radio-checkbox',
    title: 'Radio / Checkbox Selection',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Choose the option that matches the displayed value and submit it.',
    render: (context: ChallengeContext, state) =>
      renderRadioCheckbox(context, state as { options: string[]; correct: string; type: string }),
    generate: (context) => generateRadioCheckbox(context),
    validate: (_context, state, payload) =>
      validateRadioCheckbox(state as { correct: string }, payload),
  },
  {
    id: 'hidden-field-metadata',
    title: 'Hidden Field Metadata',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Find the hidden field with the specified metadata marker and submit its value.',
    render: (context: ChallengeContext, state) =>
      renderHiddenFieldMetadata(
        context,
        state as {
          token: string;
          marker: { type: string; label: string };
          fields: { name: string; isTarget: boolean }[];
        },
      ),
    generate: (context) => generateHiddenFieldMetadata(context),
    validate: (_context, state, payload) =>
      validateHiddenFieldMetadata(state as { token: string }, payload),
  },
  {
    id: 'fixed-form-basic-fields',
    title: 'Fixed Form (Basic Fields)',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain:
      'Fill mandatory fields exactly and keep optional fields blank or set them to the instructed values.',
    render: (context: ChallengeContext, state) =>
      renderFixedFormBasicFields(
        context,
        state as {
          required: {
            firstName: string;
            lastName: string;
            email: string;
            employeeId: string;
          };
          optional: {
            department: string;
            nickname: string;
          };
        },
      ),
    generate: (context) => generateFixedFormBasicFields(context),
    validate: (_context, state, payload) =>
      validateFixedFormBasicFields(
        state as {
          required: {
            firstName: string;
            lastName: string;
            email: string;
            employeeId: string;
          };
          optional: {
            department: string;
            nickname: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'fixed-form-select-radio',
    title: 'Fixed Form (Select + Radio)',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain:
      'Submit the required text, select, and radio values exactly. Optional note can be blank or match the instructed value.',
    render: (context: ChallengeContext, state) =>
      renderFixedFormSelectRadio(
        context,
        state as {
          required: {
            clientCode: string;
            region: string;
            authMode: string;
          };
          optional: {
            note: string;
          };
          options: {
            regions: string[];
            authModes: string[];
          };
        },
      ),
    generate: (context) => generateFixedFormSelectRadio(context),
    validate: (_context, state, payload) =>
      validateFixedFormSelectRadio(
        state as {
          required: {
            clientCode: string;
            region: string;
            authMode: string;
          };
          optional: {
            note: string;
          };
          options: {
            regions: string[];
            authModes: string[];
          };
        },
        payload,
      ),
  },
  {
    id: 'form-pre-submit-encoding',
    title: 'Form Pre-submit Encoding',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain:
      'Fill required form fields and submit the exact hidden payload produced by the active per-session pre-submit encoding rule.',
    render: (context: ChallengeContext, state) =>
      renderFormPreSubmitEncoding(
        context,
        state as {
          required: {
            accountId: string;
            regionCode: string;
            passphrase: string;
            nonce: string;
            encodingMode: 'base64' | 'reverse-base64' | 'base64url';
            encodingRule: string;
            encodedPayload: string;
          };
          optional: {
            note: string;
          };
        },
      ),
    generate: (context) => generateFormPreSubmitEncoding(context),
    validate: (_context, state, payload) =>
      validateFormPreSubmitEncoding(
        state as {
          required: {
            accountId: string;
            regionCode: string;
            passphrase: string;
            nonce: string;
            encodingMode: 'base64' | 'reverse-base64' | 'base64url';
            encodingRule: string;
            encodedPayload: string;
          };
          optional: {
            note: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'fixed-form-date-multi',
    title: 'Fixed Form (Date + Multi-select)',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain:
      'Submit deterministic date, textarea, and multi-select values with normalization checks.',
    render: (context: ChallengeContext, state) =>
      renderFixedFormDateMulti(
        context,
        state as {
          required: {
            clientRef: string;
            goLiveDate: string;
            summary: string;
            tags: string[];
          };
          options: {
            tags: string[];
          };
          optional: {
            reviewerNote: string;
          };
        },
      ),
    generate: (context) => generateFixedFormDateMulti(context),
    validate: (_context, state, payload) =>
      validateFixedFormDateMulti(
        state as {
          required: {
            clientRef: string;
            goLiveDate: string;
            summary: string;
            tags: string[];
          };
          options: {
            tags: string[];
          };
          optional: {
            reviewerNote: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'fixed-form-visual-controls',
    title: 'Fixed Form (Visual Controls)',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain:
      'Submit deterministic values from mixed visual controls (slider, toggle, and combobox).',
    render: (context: ChallengeContext, state) =>
      renderFixedFormVisualControls(
        context,
        state as {
          required: {
            clientRef: string;
            trustScore: number;
            alertsEnabled: boolean;
            accessProfile: string;
          };
          options: {
            accessProfiles: string[];
          };
          optional: {
            note: string;
          };
        },
      ),
    generate: (context) => generateFixedFormVisualControls(context),
    validate: (_context, state, payload) =>
      validateFixedFormVisualControls(
        state as {
          required: {
            clientRef: string;
            trustScore: number;
            alertsEnabled: boolean;
            accessProfile: string;
          };
          options: {
            accessProfiles: string[];
          };
          optional: {
            note: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'auth-cookie-boot',
    title: 'Auth Cookie Boot',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Submit matching cookie and form bootstrap tokens with the expected boot state value.',
    render: (context: ChallengeContext, state) =>
      renderAuthCookieBoot(
        context,
        state as {
          required: {
            username: string;
            cookieToken: string;
            formToken: string;
            bootState: string;
          };
          optional: {
            note: string;
          };
        },
      ),
    generate: (context) => generateAuthCookieBoot(context),
    validate: (_context, state, payload) =>
      validateAuthCookieBoot(
        state as {
          required: {
            username: string;
            cookieToken: string;
            formToken: string;
            bootState: string;
          };
          optional: {
            note: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'csrf-double-submit',
    title: 'CSRF Double-submit',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Submit matching CSRF cookie/body token values with the required request nonce.',
    render: (context: ChallengeContext, state) =>
      renderCsrfDoubleSubmit(
        context,
        state as {
          required: {
            username: string;
            csrfCookie: string;
            csrfBody: string;
            requestNonce: string;
          };
          optional: {
            note: string;
          };
        },
      ),
    generate: (context) => generateCsrfDoubleSubmit(context),
    validate: (_context, state, payload) =>
      validateCsrfDoubleSubmit(
        state as {
          required: {
            username: string;
            csrfCookie: string;
            csrfBody: string;
            requestNonce: string;
          };
          optional: {
            note: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'auth-header-switch',
    title: 'Auth Header Switch',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain:
      'Submit the active auth header name/value pair based on the per-session header source rule.',
    render: (context: ChallengeContext, state) =>
      renderAuthHeaderSwitch(
        context,
        state as {
          required: {
            username: string;
            correlationId: string;
            headerName: string;
            headerValue: string;
            rule: 'user-bound' | 'correlation-bound' | 'nonce-derived';
          };
          optional: {
            note: string;
          };
        },
      ),
    generate: (context) => generateAuthHeaderSwitch(context),
    validate: (_context, state, payload) =>
      validateAuthHeaderSwitch(
        state as {
          required: {
            username: string;
            correlationId: string;
            headerName: string;
            headerValue: string;
            rule: 'user-bound' | 'correlation-bound' | 'nonce-derived';
          };
          optional: {
            note: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'nonce-login-window',
    title: 'Nonce Login Window',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Submit login values before nonce expiry with exact nonce and proof correlation.',
    render: (context: ChallengeContext, state) =>
      renderNonceLoginWindow(
        context,
        state as {
          required: {
            username: string;
            nonce: string;
            nonceIssuedAt: number;
            nonceWindowMs: number;
            loginProof: string;
          };
          optional: {
            note: string;
          };
        },
      ),
    generate: (context) => generateNonceLoginWindow(context),
    validate: (_context, state, payload) =>
      validateNonceLoginWindow(
        state as {
          required: {
            username: string;
            nonce: string;
            nonceIssuedAt: number;
            nonceWindowMs: number;
            loginProof: string;
          };
          optional: {
            note: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'jwt-lite-claims',
    title: 'JWT-lite Claims',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain:
      'Decode a non-signed training JWT payload and submit the required claim key/value pair.',
    render: (context: ChallengeContext, state) =>
      renderJwtLiteClaims(
        context,
        state as {
          required: {
            jwtToken: string;
            claimKey: string;
            claimValue: string;
          };
          optional: {
            note: string;
          };
        },
      ),
    generate: (context) => generateJwtLiteClaims(context),
    validate: (_context, state, payload) =>
      validateJwtLiteClaims(
        state as {
          required: {
            jwtToken: string;
            claimKey: string;
            claimValue: string;
          };
          optional: {
            note: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'oauth-pkce-mini',
    title: 'OAuth PKCE Mini',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain:
      'Simulate one-page auth code exchange with strict state, code verifier, challenge, and token-binding checks.',
    render: (context: ChallengeContext, state) =>
      renderOauthPkceMini(
        context,
        state as {
          required: {
            clientId: string;
            redirectUri: string;
            state: string;
            authCode: string;
            codeVerifier: string;
            codeChallengeMethod: 'S256';
            codeChallenge: string;
            tokenBinding: string;
          };
          optional: {
            note: string;
          };
        },
      ),
    generate: (context) => generateOauthPkceMini(context),
    validate: (_context, state, payload) =>
      validateOauthPkceMini(
        state as {
          required: {
            clientId: string;
            redirectUri: string;
            state: string;
            authCode: string;
            codeVerifier: string;
            codeChallengeMethod: 'S256';
            codeChallenge: string;
            tokenBinding: string;
          };
          optional: {
            note: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'refresh-rotation',
    title: 'Refresh Rotation',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain:
      'Submit a valid two-step refresh lifecycle where the second exchange uses the rotated refresh token.',
    render: (context: ChallengeContext, state) =>
      renderRefreshRotation(
        context,
        state as {
          required: {
            sessionId: string;
            refreshTokenV1: string;
            refreshTokenV2: string;
            accessTokenStep1: string;
            accessTokenStep2: string;
            rotationState: string;
          };
          optional: {
            note: string;
          };
        },
      ),
    generate: (context) => generateRefreshRotation(context),
    validate: (_context, state, payload) =>
      validateRefreshRotation(
        state as {
          required: {
            sessionId: string;
            refreshTokenV1: string;
            refreshTokenV2: string;
            accessTokenStep1: string;
            accessTokenStep2: string;
            rotationState: string;
          };
          optional: {
            note: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'redirect-state-hop',
    title: 'Redirect State Hop',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Capture redirect state and submit hop-trail correlation values exactly.',
    render: (context: ChallengeContext, state) =>
      renderRedirectStateHop(
        context,
        state as {
          required: {
            initialPath: string;
            intermediatePath: string;
            finalPath: string;
            state: string;
            hopTrail: string;
            redirectSignature: string;
          };
        },
      ),
    generate: (context) => generateRedirectStateHop(context),
    validate: (_context, state, payload) =>
      validateRedirectStateHop(
        state as {
          required: {
            initialPath: string;
            intermediatePath: string;
            finalPath: string;
            state: string;
            hopTrail: string;
            redirectSignature: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'redirect-token-pickup-basic',
    title: 'Redirect Token Pickup (Basic)',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Run the redirect flow, capture the redirected token, then submit the exact value.',
    render: (context: ChallengeContext, state) =>
      renderRedirectTokenPickupBasic(
        context,
        state as {
          token: string;
          hopToken: string;
          pickupConfirmed: boolean;
        },
      ),
    generate: (context) => generateRedirectTokenPickupBasic(context),
    validate: (_context, state, payload) =>
      validateRedirectTokenPickupBasic(
        state as {
          token: string;
          hopToken: string;
          pickupConfirmed: boolean;
        },
        payload,
      ),
  },
  {
    id: 'redirect-token-branching',
    title: 'Redirect Token Branching',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain:
      'Follow the instructed branch redirect flow, pick up the branch token, and submit the exact required token.',
    render: (context: ChallengeContext, state) =>
      renderRedirectTokenBranching(
        context,
        state as {
          expectedBranch: 'alpha' | 'beta';
          tokens: { alpha: string; beta: string };
          hopKeys: { alpha: string; beta: string };
          pickupConfirmed: boolean;
          pickedBranch: 'alpha' | 'beta' | null;
        },
      ),
    generate: (context) => generateRedirectTokenBranching(context),
    validate: (_context, state, payload) =>
      validateRedirectTokenBranching(
        state as {
          expectedBranch: 'alpha' | 'beta';
          tokens: { alpha: string; beta: string };
          hopKeys: { alpha: string; beta: string };
          pickupConfirmed: boolean;
          pickedBranch: 'alpha' | 'beta' | null;
        },
        payload,
      ),
  },
  {
    id: 'page-timeout-idle',
    title: 'Page Idle Timeout',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Submit the current token before idle timeout expires, or refresh and retry.',
    render: (context: ChallengeContext, state) =>
      renderPageTimeoutIdle(
        context,
        state as {
          token: string;
          issuedAt: number;
          idleTimeoutMs: number;
          refreshCount: number;
        },
      ),
    generate: (context) => generatePageTimeoutIdle(context),
    validate: (_context, state, payload) =>
      validatePageTimeoutIdle(
        state as {
          token: string;
          issuedAt: number;
          idleTimeoutMs: number;
          refreshCount: number;
        },
        payload,
      ),
  },
  {
    id: 'page-timeout-step-window',
    title: 'Page Timeout Step Window',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain: 'Complete multi-step token continuity within per-step and overall timeout windows.',
    render: (context: ChallengeContext, state) =>
      renderPageTimeoutStepWindow(
        context,
        state as {
          transactionId: string;
          issuedAt: number;
          expiresAt: number;
          maxStepGapMs: number;
          stepTokens: {
            step1: string;
            step2: string;
            step3: string;
          };
        },
      ),
    generate: (context) => generatePageTimeoutStepWindow(context),
    validate: (_context, state, payload) =>
      validatePageTimeoutStepWindow(
        state as {
          transactionId: string;
          issuedAt: number;
          expiresAt: number;
          maxStepGapMs: number;
          stepTokens: {
            step1: string;
            step2: string;
            step3: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'saml-redirect-lite',
    title: 'SAML Redirect Lite',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain:
      'Validate simplified SAML redirect correlation fields from an encoded SAMLRequest payload.',
    render: (context: ChallengeContext, state) =>
      renderSamlRedirectLite(
        context,
        state as {
          relayState: string;
          inResponseTo: string;
          issuer: string;
          samlRequestB64: string;
        },
      ),
    generate: (context) => generateSamlRedirectLite(context),
    validate: (_context, state, payload) =>
      validateSamlRedirectLite(
        state as {
          relayState: string;
          inResponseTo: string;
          issuer: string;
          samlRequestB64: string;
        },
        payload,
      ),
  },
  {
    id: 'saml-post-lite',
    title: 'SAML Post Lite',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain: 'Validate simplified SAML POST fields from a base64-encoded SAMLResponse payload.',
    render: (context: ChallengeContext, state) =>
      renderSamlPostLite(
        context,
        state as {
          nameId: string;
          audience: string;
          recipient: string;
          notOnOrAfter: string;
          samlResponseB64: string;
        },
      ),
    generate: (context) => generateSamlPostLite(context),
    validate: (_context, state, payload) =>
      validateSamlPostLite(
        state as {
          nameId: string;
          audience: string;
          recipient: string;
          notOnOrAfter: string;
          samlResponseB64: string;
        },
        payload,
      ),
  },
  {
    id: 'stepup-mfa-sequence',
    title: 'Step-up MFA Sequence',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain: 'Complete the multi-step auth chain with correct MFA values and final session token.',
    render: (context: ChallengeContext, state) =>
      renderStepupMfaSequence(
        context,
        state as {
          transactionId: string;
          username: string;
          passwordHint: string;
          mfaMethod: 'totp' | 'push';
          otpCode: string;
          approvalToken: string;
          finalSessionToken: string;
          expiresAt: number;
        },
      ),
    generate: (context) => generateStepupMfaSequence(context),
    validate: (_context, state, payload) =>
      validateStepupMfaSequence(
        state as {
          transactionId: string;
          username: string;
          passwordHint: string;
          mfaMethod: 'totp' | 'push';
          otpCode: string;
          approvalToken: string;
          finalSessionToken: string;
          expiresAt: number;
        },
        payload,
      ),
  },
  {
    id: 'one-page-auth-wizard',
    title: 'One-page Auth Wizard',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain:
      'Complete a single-page 3-step auth state machine with strict step token chaining and final session token.',
    render: (context: ChallengeContext, state) =>
      renderOnePageAuthWizard(
        context,
        state as {
          transactionId: string;
          username: string;
          secretAnswer: string;
          mfaCode: string;
          finalSessionToken: string;
          stepTokens: {
            step1: string;
            step2: string;
            step3: string;
          };
          expectedWizardState: string;
          expiresAt: number;
        },
      ),
    generate: (context) => generateOnePageAuthWizard(context),
    validate: (_context, state, payload) =>
      validateOnePageAuthWizard(
        state as {
          transactionId: string;
          username: string;
          secretAnswer: string;
          mfaCode: string;
          finalSessionToken: string;
          stepTokens: {
            step1: string;
            step2: string;
            step3: string;
          };
          expectedWizardState: string;
          expiresAt: number;
        },
        payload,
      ),
  },
  {
    id: 'tabbed-form-progressive',
    title: 'Tabbed Form (Progressive)',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Complete required fields across tabs and submit the expected tab traversal order.',
    render: (context: ChallengeContext, state) =>
      renderTabbedFormProgressive(
        context,
        state as {
          required: {
            profileId: string;
            email: string;
            region: string;
          };
          optional: {
            note: string;
          };
          expectedTabOrder: string;
          regionOptions: string[];
        },
      ),
    generate: (context) => generateTabbedFormProgressive(context),
    validate: (_context, state, payload) =>
      validateTabbedFormProgressive(
        state as {
          required: {
            profileId: string;
            email: string;
            region: string;
          };
          optional: {
            note: string;
          };
          expectedTabOrder: string;
          regionOptions: string[];
        },
        payload,
      ),
  },
  {
    id: 'pagination-sequential-pick',
    title: 'Pagination Sequential Pick',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain:
      'Traverse paginated sections in order and submit the picked token from each page in sequence.',
    render: (context: ChallengeContext, state) =>
      renderPaginationSequentialPick(
        context,
        state as {
          pages: {
            page: number;
            rows: { itemId: string; token: string; isTarget: boolean }[];
          }[];
          expected: {
            page1: string;
            page2: string;
            page3: string;
          };
          expectedPageTrail: string;
        },
      ),
    generate: (context) => generatePaginationSequentialPick(context),
    validate: (_context, state, payload) =>
      validatePaginationSequentialPick(
        state as {
          pages: {
            page: number;
            rows: { itemId: string; token: string; isTarget: boolean }[];
          }[];
          expected: {
            page1: string;
            page2: string;
            page3: string;
          };
          expectedPageTrail: string;
        },
        payload,
      ),
  },
  {
    id: 'pagination-filter-then-pick',
    title: 'Pagination Filter Then Pick',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain:
      'Apply filter and sort rules, traverse pages in order, then submit the final selected ticket id.',
    render: (context: ChallengeContext, state) =>
      renderPaginationFilterThenPick(
        context,
        state as {
          pages: {
            page: number;
            rows: {
              ticketId: string;
              region: string;
              status: string;
              priority: number;
              isTarget: boolean;
            }[];
          }[];
          rule: {
            filterMode: 'region' | 'status';
            filterValue: string;
            sortMode: 'priority-desc' | 'ticket-asc';
            expectedPageTrail: string;
          };
          expected: {
            targetTicketId: string;
          };
        },
      ),
    generate: (context) => generatePaginationFilterThenPick(context),
    validate: (_context, state, payload) =>
      validatePaginationFilterThenPick(
        state as {
          pages: {
            page: number;
            rows: {
              ticketId: string;
              region: string;
              status: string;
              priority: number;
              isTarget: boolean;
            }[];
          }[];
          rule: {
            filterMode: 'region' | 'status';
            filterValue: string;
            sortMode: 'priority-desc' | 'ticket-asc';
            expectedPageTrail: string;
          };
          expected: {
            targetTicketId: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'menu-click-basic',
    title: 'Menu Click Basic',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Open the menu and select the instructed item label exactly.',
    render: (context: ChallengeContext, state) =>
      renderMenuClickBasic(
        context,
        state as {
          menuId: string;
          items: { id: string; label: string }[];
          required: {
            itemId: string;
            itemLabel: string;
            expectedMenuState: string;
          };
        },
      ),
    generate: (context) => generateMenuClickBasic(context),
    validate: (_context, state, payload) =>
      validateMenuClickBasic(
        state as {
          menuId: string;
          items: { id: string; label: string }[];
          required: {
            itemId: string;
            itemLabel: string;
            expectedMenuState: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'menu-hover-delay',
    title: 'Menu Hover Delay',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Hover-open the menu, satisfy delay, then select the instructed item label.',
    render: (context: ChallengeContext, state) =>
      renderMenuHoverDelay(
        context,
        state as {
          menuId: string;
          items: { id: string; label: string }[];
          required: {
            itemId: string;
            itemLabel: string;
            minHoverMs: number;
            expectedMenuState: string;
          };
        },
      ),
    generate: (context) => generateMenuHoverDelay(context),
    validate: (_context, state, payload) =>
      validateMenuHoverDelay(
        state as {
          menuId: string;
          items: { id: string; label: string }[];
          required: {
            itemId: string;
            itemLabel: string;
            minHoverMs: number;
            expectedMenuState: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'menu-submenu-path',
    title: 'Menu Submenu Path',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain: 'Open nested menu path and submit exact menu > submenu > item selection.',
    render: (context: ChallengeContext, state) =>
      renderMenuSubmenuPath(
        context,
        state as {
          menuId: string;
          branches: {
            id: string;
            label: string;
            submenu: {
              id: string;
              label: string;
              items: { id: string; label: string }[];
            }[];
          }[];
          required: {
            menuLabel: string;
            submenuLabel: string;
            itemLabel: string;
            itemId: string;
            expectedPath: string;
            expectedMenuState: string;
          };
        },
      ),
    generate: (context) => generateMenuSubmenuPath(context),
    validate: (_context, state, payload) =>
      validateMenuSubmenuPath(
        state as {
          menuId: string;
          branches: {
            id: string;
            label: string;
            submenu: {
              id: string;
              label: string;
              items: { id: string; label: string }[];
            }[];
          }[];
          required: {
            menuLabel: string;
            submenuLabel: string;
            itemLabel: string;
            itemId: string;
            expectedPath: string;
            expectedMenuState: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'menu-theme-variant',
    title: 'Menu Theme Variant',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain: 'Select the instructed menu target under rotating render attribute variants.',
    render: (context: ChallengeContext, state) =>
      renderMenuThemeVariant(
        context,
        state as {
          menuId: string;
          items: { id: string; label: string }[];
          required: {
            itemId: string;
            itemLabel: string;
            expectedMenuState: string;
            variant: 'data-key' | 'aria-route' | 'test-id';
          };
        },
      ),
    generate: (context) => generateMenuThemeVariant(context),
    validate: (_context, state, payload) =>
      validateMenuThemeVariant(
        state as {
          menuId: string;
          items: { id: string; label: string }[];
          required: {
            itemId: string;
            itemLabel: string;
            expectedMenuState: string;
            variant: 'data-key' | 'aria-route' | 'test-id';
          };
        },
        payload,
      ),
  },
  {
    id: 'fiori-table-id-pattern',
    title: 'Fiori Table ID Pattern',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain:
      'Resolve target cell identity by row key and column key while volatile id fragments change each run.',
    render: (context: ChallengeContext, state) =>
      renderFioriTableIdPattern(
        context,
        state as {
          tableId: string;
          cells: {
            rowKey: string;
            stock: string;
            volatileCellId: string;
          }[];
          required: {
            rowKey: string;
            columnKey: 'stock';
            volatileCellId: string;
            expectedIdentity: string;
          };
        },
      ),
    generate: (context) => generateFioriTableIdPattern(context),
    validate: (_context, state, payload) =>
      validateFioriTableIdPattern(
        state as {
          tableId: string;
          cells: {
            rowKey: string;
            stock: string;
            volatileCellId: string;
          }[];
          required: {
            rowKey: string;
            columnKey: 'stock';
            volatileCellId: string;
            expectedIdentity: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'fiori-table-compound-selector',
    title: 'Fiori Table Compound Selector',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain:
      'Resolve target cell via compound anchors (row + action + metric) while volatile id numbers rotate.',
    render: (context: ChallengeContext, state) =>
      renderFioriTableCompoundSelector(
        context,
        state as {
          tableId: string;
          cells: {
            rowKey: string;
            action: string;
            metric: 'stock' | 'latency';
            value: string;
            volatileCellId: string;
            roleAnchor: string;
          }[];
          required: {
            rowKey: string;
            action: string;
            metric: 'stock' | 'latency';
            roleAnchor: string;
            expectedIdentity: string;
          };
        },
      ),
    generate: (context) => generateFioriTableCompoundSelector(context),
    validate: (_context, state, payload) =>
      validateFioriTableCompoundSelector(
        state as {
          tableId: string;
          cells: {
            rowKey: string;
            action: string;
            metric: 'stock' | 'latency';
            value: string;
            volatileCellId: string;
            roleAnchor: string;
          }[];
          required: {
            rowKey: string;
            action: string;
            metric: 'stock' | 'latency';
            roleAnchor: string;
            expectedIdentity: string;
          };
        },
        payload,
      ),
  },
  {
    id: 'tabbed-form-conditional',
    title: 'Tabbed Form (Conditional)',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain:
      'Apply conditional required rules across tabs and submit the expected tab traversal order.',
    render: (context: ChallengeContext, state) =>
      renderTabbedFormConditional(
        context,
        state as {
          required: {
            caseId: string;
            contactEmail: string;
            supportTier: string;
            region: string;
          };
          optional: {
            note: string;
            priorityCode: string;
            complianceTag: string;
          };
          conditions: {
            requirePriorityCode: boolean;
            requireComplianceTag: boolean;
          };
          expectedTabOrder: string;
          supportTierOptions: string[];
          regionOptions: string[];
        },
      ),
    generate: (context) => generateTabbedFormConditional(context),
    validate: (_context, state, payload) =>
      validateTabbedFormConditional(
        state as {
          required: {
            caseId: string;
            contactEmail: string;
            supportTier: string;
            region: string;
          };
          optional: {
            note: string;
            priorityCode: string;
            complianceTag: string;
          };
          conditions: {
            requirePriorityCode: boolean;
            requireComplianceTag: boolean;
          };
          expectedTabOrder: string;
          supportTierOptions: string[];
          regionOptions: string[];
        },
        payload,
      ),
  },
  {
    id: 'hidden-field-metadata-auto',
    title: 'Hidden Field Metadata (Auto)',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Submit the form; the hidden field with the marker contains the target value.',
    render: (context: ChallengeContext, state) =>
      renderHiddenFieldMetadataAuto(
        context,
        state as {
          token: string;
          marker: { type: string; label: string };
          fields: { name: string; isTarget: boolean }[];
        },
      ),
    generate: (context) => generateHiddenFieldMetadataAuto(context),
    validate: (_context, state, payload) =>
      validateHiddenFieldMetadataAuto(state as { token: string }, payload),
  },
  {
    id: 'auto-filled-js',
    title: 'Auto-filled JS Values',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Read the auto-populated value and submit it as-is.',
    render: (context: ChallengeContext, state) =>
      renderAutoFilledJs(context, state as { value: string }),
    generate: (context) => generateAutoFilledJs(context),
    validate: (_context, state, payload) =>
      validateAutoFilledJs(state as { value: string }, payload),
  },
  {
    id: 'sse-delivered',
    title: 'SSE Delivered Values',
    toolAffinity: 'browser',
    difficulty: 'grand-master',
    explain: 'Connect to the SSE stream and submit the delivered value.',
    render: (context: ChallengeContext) => renderSseDelivered(context),
    generate: (context) => generateSseDelivered(context),
    validate: (_context, state, payload) =>
      validateSseDelivered(state as { value: string }, payload),
  },
  {
    id: 'ws-delivered',
    title: 'WebSocket Delivered Values',
    toolAffinity: 'browser',
    difficulty: 'grand-master',
    explain: 'Open the WebSocket, request the challenge value, and submit the response.',
    render: (context: ChallengeContext) => renderWsDelivered(context),
    generate: (context) => generateWsDelivered(context),
    validate: (_context, state, payload) =>
      validateWsDelivered(state as { value: string }, payload),
  },
  {
    id: 'selector-variant-a',
    title: 'Selector Variant A',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Locate the element by the provided selector type and submit its value.',
    render: (context: ChallengeContext, state) =>
      renderSelectorVariant(
        context,
        state as {
          value: string;
          selectorType: 'data-key' | 'aria-label' | 'data-testid';
          stableKey: string;
          decoys: string[];
        },
      ),
    generate: (context) => generateSelectorVariant(context, 'a'),
    validate: (_context, state, payload) =>
      validateSelectorVariant(state as { value: string }, payload),
  },
  {
    id: 'selector-variant-b',
    title: 'Selector Variant B',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Locate the element by the provided selector type and submit its value.',
    render: (context: ChallengeContext, state) =>
      renderSelectorVariant(
        context,
        state as {
          value: string;
          selectorType: 'data-key' | 'aria-label' | 'data-testid';
          stableKey: string;
          decoys: string[];
        },
      ),
    generate: (context) => generateSelectorVariant(context, 'b'),
    validate: (_context, state, payload) =>
      validateSelectorVariant(state as { value: string }, payload),
  },
  {
    id: 'dom-shuffling',
    title: 'DOM Shuffling',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Find the element marked with the target attribute and submit its text.',
    render: (context: ChallengeContext, state) =>
      renderDomShuffling(context, state as { items: { value: string; isTarget: boolean }[] }),
    generate: (context) => generateDomShuffling(context),
    validate: (_context, state, payload) =>
      validateDomShuffling(state as { correct: string }, payload),
  },
  {
    id: 'shadow-canvas',
    title: 'Shadow DOM / Canvas Token',
    toolAffinity: 'browser',
    difficulty: 'grand-master',
    explain: 'Extract the token from the canvas or DOM and submit it.',
    render: (context: ChallengeContext, state) =>
      renderShadowCanvas(context, state as { token: string }),
    generate: (context) => generateShadowCanvas(context),
    validate: (_context, state, payload) =>
      validateShadowCanvas(state as { token: string }, payload),
  },
  {
    id: 'decoy-inputs',
    title: 'Decoy Inputs & Layout Traps',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Identify the valid input by its marker and submit its value.',
    render: (context: ChallengeContext, state) =>
      renderDecoyInputs(
        context,
        state as { inputs: { name: string; value: string; valid: boolean }[] },
      ),
    generate: (context) => generateDecoyInputs(context),
    validate: (_context, state, payload) =>
      validateDecoyInputs(state as { correct: string }, payload),
  },
  {
    id: 'timing-window',
    title: 'Timing Window',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Submit within the required time window with the expected value.',
    render: (context: ChallengeContext, state) =>
      renderTimingWindow(context, state as { minDelayMs: number; maxDelayMs: number }),
    generate: (context) => generateTimingWindow(context),
    validate: (_context, state, payload) =>
      validateTimingWindow(
        state as { createdAt: number; minDelayMs: number; maxDelayMs: number },
        payload,
      ),
  },
  {
    id: 'token-assembly',
    title: 'Token Assembly',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Assemble the token in order using the data-order attribute and submit it.',
    render: (context: ChallengeContext, state) =>
      renderTokenAssembly(context, state as { parts: { value: string; index: number }[] }),
    generate: (context) => generateTokenAssembly(context),
    validate: (_context, state, payload) =>
      validateTokenAssembly(state as { token: string }, payload),
  },
  {
    id: 'request-integrity',
    title: 'Request Integrity',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Compute the HMAC using the SSE secret and the nonce, then submit it.',
    render: (context: ChallengeContext, state) =>
      renderRequestIntegrity(context, state as { nonce: string }),
    generate: (context) => generateRequestIntegrity(context),
    validate: (_context, state, payload) =>
      validateRequestIntegrity(state as { secret: string; nonce: string }, payload),
  },
  {
    id: 'header-derived',
    title: 'Header-derived Value',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Use the hinted response header value as the answer.',
    render: (context: ChallengeContext, state) =>
      renderHeaderDerived(context, state as { hint: string }),
    generate: (context) => generateHeaderDerived(context),
    validate: (_context, state, payload) =>
      validateHeaderDerived(state as { value: string }, payload),
  },
  {
    id: 'downloaded-file-plain',
    title: 'Downloaded File Token (Plain)',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Download the file, read TOKEN=..., and submit the token value.',
    render: (context: ChallengeContext, state) =>
      renderDownloadedFilePlain(context, state as { filename: string }),
    generate: (context) => generateDownloadedFilePlain(context),
    validate: (_context, state, payload) =>
      validateDownloadedFilePlain(state as { token: string }, payload),
  },
  {
    id: 'downloaded-file-encoded',
    title: 'Downloaded File Token (Encoded)',
    toolAffinity: 'either',
    difficulty: 'advanced',
    explain: 'Download the file, decode payload per rule, and submit the token.',
    render: (context: ChallengeContext, state) =>
      renderDownloadedFileEncoded(
        context,
        state as { encoding: 'base64' | 'hex'; filename: string },
      ),
    generate: (context) => generateDownloadedFileEncoded(context),
    validate: (_context, state, payload) =>
      validateDownloadedFileEncoded(
        state as { token: string; encoding: 'base64' | 'hex' },
        payload,
      ),
  },
  {
    id: 'create-upload-file',
    title: 'Create and Upload File',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Create a file with required filename/content rule, upload it, and submit.',
    render: (context: ChallengeContext, state) =>
      renderCreateUploadFile(
        context,
        state as { token: string; encoding: 'plain' | 'base64'; expectedFilename: string },
      ),
    generate: (context) => generateCreateUploadFile(context),
    validate: (_context, state, payload) =>
      validateCreateUploadFile(
        state as { token: string; encoding: 'plain' | 'base64'; expectedFilename: string },
        payload,
      ),
  },
  {
    id: 'api-table-guid',
    title: 'API Table GUID Selection',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Call the products API, apply the target rule, and submit the matching row GUID.',
    render: (context: ChallengeContext, state) =>
      renderApiTableGuid(
        context,
        state as {
          targetRule:
            | { mode: 'sku'; sku: string; instruction: string }
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
        },
      ),
    generate: (context) => generateApiTableGuid(context),
    validate: (_context, state, payload) =>
      validateApiTableGuid(state as { targetGuid: string }, payload),
  },
  {
    id: 'large-pool-selection',
    title: 'Large-pool Item Selection',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Select exactly the instructed item(s) from randomized options and submit.',
    render: (context: ChallengeContext, state) =>
      renderLargePoolSelection(
        context,
        state as { selectionType: 'checkbox' | 'radio'; options: string[]; targets: string[] },
      ),
    generate: (context) => generateLargePoolSelection(context),
    validate: (_context, state, payload) =>
      validateLargePoolSelection(
        state as { selectionType: 'checkbox' | 'radio'; targets: string[] },
        payload,
      ),
  },
  {
    id: 'word-order-position',
    title: 'Word Order Position',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Sort words per rule and submit the required positional word.',
    render: (context: ChallengeContext, state) =>
      renderWordOrderPosition(
        context,
        state as {
          words: string[];
          direction: 'asc' | 'desc';
          caseMode: 'sensitive' | 'insensitive';
          from: 'top' | 'bottom';
          nth: number;
        },
      ),
    generate: (context) => generateWordOrderPosition(context),
    validate: (_context, state, payload) =>
      validateWordOrderPosition(state as { expected: string }, payload),
  },
  {
    id: 'markdown-pdf-upload',
    title: 'Markdown to PDF Upload',
    toolAffinity: 'either',
    difficulty: 'grand-master',
    explain: 'Convert disabled markdown into a PDF file and upload the expected artifact.',
    render: (context: ChallengeContext, state) =>
      renderMarkdownPdfUpload(
        context,
        state as {
          markdown: string;
          expectedFilename: string;
        },
      ),
    generate: (context) => generateMarkdownPdfUpload(context),
    validate: (_context, state, payload) =>
      validateMarkdownPdfUpload(
        state as {
          expectedFilename: string;
          expectedHash: string;
        },
        payload,
      ),
  },
];

export const getChallengeRuntimeByIndex = (index: number) => {
  const safeIndex = Math.max(1, index);
  const runtimeIndex = (safeIndex - 1) % challengeRuntimes.length;
  return challengeRuntimes[runtimeIndex];
};

export const getChallengeRuntimeById = (id: string) => {
  return challengeRuntimes.find((runtime) => runtime.id === id) ?? challengeRuntimes[0];
};
