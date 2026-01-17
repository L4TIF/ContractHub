export type FieldType = 'text' | 'date' | 'signature' | 'checkbox';

export interface BlueprintField {
  id: string;
  type: FieldType;
  label: string;
  position: { x: number; y: number };
  required?: boolean;
}

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  fields: BlueprintField[];
  createdAt: string;
  updatedAt: string;
}

export type ContractStatus = 'created' | 'approved' | 'sent' | 'signed' | 'locked' | 'revoked';

export interface ContractFieldValue {
  fieldId: string;
  value: string | boolean;
}

export interface Contract {
  id: string;
  name: string;
  blueprintId: string;
  blueprintName: string;
  status: ContractStatus;
  fieldValues: ContractFieldValue[];
  createdAt: string;
  updatedAt: string;
}

export const STATUS_FLOW: ContractStatus[] = ['created', 'approved', 'sent', 'signed', 'locked'];

export const getNextStatus = (current: ContractStatus): ContractStatus | null => {
  if (current === 'locked' || current === 'revoked') return null;
  const currentIndex = STATUS_FLOW.indexOf(current);
  if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[currentIndex + 1];
};

export const canRevoke = (status: ContractStatus): boolean => {
  return status === 'created' || status === 'sent';
};

export const isEditable = (status: ContractStatus): boolean => {
  return status !== 'locked' && status !== 'revoked';
};
