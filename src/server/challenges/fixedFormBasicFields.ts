import type { ChallengeContext } from './types.js';
import { randomInt, randomString, pick } from './utils.js';

type FixedFormBasicFieldsData = {
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
};

const FIRST_NAMES = [
  'Ava',
  'Mason',
  'Olivia',
  'Ethan',
  'Sophia',
  'Noah',
  'Mia',
  'Liam',
  'Isla',
  'Lucas',
];

const LAST_NAMES = [
  'Rivera',
  'Patel',
  'Chen',
  'Nguyen',
  'Singh',
  'Bennett',
  'Khan',
  'Silva',
  'Brooks',
  'Walker',
];

const DEPARTMENTS = ['Operations', 'Finance', 'Engineering', 'Support', 'Quality'];

export const generateFixedFormBasicFields = (
  context: ChallengeContext,
): FixedFormBasicFieldsData => {
  const firstName = pick(FIRST_NAMES, context.rng);
  const lastName = pick(LAST_NAMES, context.rng);
  const email =
    `${firstName}.${lastName}.${randomString(3, context.rng)}@client.example`.toLowerCase();
  const employeeId = `EMP-${randomInt(1000, 9999, context.rng)}`;

  return {
    required: {
      firstName,
      lastName,
      email,
      employeeId,
    },
    optional: {
      department: pick(DEPARTMENTS, context.rng),
      nickname: `${firstName.slice(0, 2).toUpperCase()}-${randomString(3, context.rng).toUpperCase()}`,
    },
  };
};

export const renderFixedFormBasicFields = (
  context: ChallengeContext,
  data: FixedFormBasicFieldsData,
) => {
  return `
    <h1>Challenge ${context.index}: Fixed Form (Basic Fields)</h1>
    <p class="muted">Use the details below to fill the form. Fields marked * are mandatory.</p>
    <ul class="muted">
      <li>First Name*: <strong>${data.required.firstName}</strong></li>
      <li>Last Name*: <strong>${data.required.lastName}</strong></li>
      <li>Email*: <strong>${data.required.email}</strong></li>
      <li>Employee ID*: <strong>${data.required.employeeId}</strong></li>
      <li>Department (optional): <strong>${data.optional.department}</strong></li>
      <li>Nickname (optional): <strong>${data.optional.nickname}</strong></li>
    </ul>
    <label class="muted" for="firstName">First Name*</label>
    <input id="firstName" name="firstName" type="text" required />

    <label class="muted" for="lastName">Last Name*</label>
    <input id="lastName" name="lastName" type="text" required />

    <label class="muted" for="email">Email*</label>
    <input id="email" name="email" type="text" required />

    <label class="muted" for="employeeId">Employee ID*</label>
    <input id="employeeId" name="employeeId" type="text" required />

    <label class="muted" for="department">Department (optional)</label>
    <input id="department" name="department" type="text" />

    <label class="muted" for="nickname">Nickname (optional)</label>
    <input id="nickname" name="nickname" type="text" />
  `;
};

const readValue = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateFixedFormBasicFields = (
  data: FixedFormBasicFieldsData,
  payload: Record<string, unknown>,
) => {
  const firstName = readValue(payload, 'firstName');
  const lastName = readValue(payload, 'lastName');
  const email = readValue(payload, 'email').toLowerCase();
  const employeeId = readValue(payload, 'employeeId');

  if (
    firstName !== data.required.firstName ||
    lastName !== data.required.lastName ||
    email !== data.required.email.toLowerCase() ||
    employeeId !== data.required.employeeId
  ) {
    return false;
  }

  const department = readValue(payload, 'department');
  if (department && department !== data.optional.department) {
    return false;
  }

  const nickname = readValue(payload, 'nickname');
  if (nickname && nickname !== data.optional.nickname) {
    return false;
  }

  return true;
};
