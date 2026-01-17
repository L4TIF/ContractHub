import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Blueprint, Contract, ContractStatus, ContractFieldValue, getNextStatus, canRevoke, BlueprintField } from '@/types';

// Default blueprints with proper spacing (100px vertical gap between rows)
const defaultBlueprints: Omit<Blueprint, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Employee Contract',
    description: 'Standard employment agreement with key terms and conditions',
    fields: [
      { id: 'emp_name', type: 'text', label: 'Employee Name', position: { x: 30, y: 20 }, required: true },
      { id: 'emp_salary', type: 'text', label: 'Annual Salary', position: { x: 280, y: 20 }, required: true },
      { id: 'emp_title', type: 'text', label: 'Job Title', position: { x: 30, y: 120 }, required: true },
      { id: 'emp_start', type: 'date', label: 'Start Date', position: { x: 280, y: 120 }, required: true },
      { id: 'emp_nda', type: 'checkbox', label: 'NDA Agreement', position: { x: 30, y: 220 }, required: true },
      { id: 'emp_sign', type: 'signature', label: 'Employee Signature', position: { x: 30, y: 320 }, required: true },
      { id: 'mgr_sign', type: 'signature', label: 'Manager Signature', position: { x: 280, y: 320 }, required: true },
    ],
  },
  {
    name: 'Client Agreement',
    description: 'Professional services agreement for client engagements',
    fields: [
      { id: 'client_name', type: 'text', label: 'Client Name', position: { x: 30, y: 20 }, required: true },
      { id: 'client_company', type: 'text', label: 'Company Name', position: { x: 280, y: 20 }, required: true },
      { id: 'project_name', type: 'text', label: 'Project Name', position: { x: 30, y: 120 }, required: true },
      { id: 'project_value', type: 'text', label: 'Project Value', position: { x: 280, y: 120 }, required: true },
      { id: 'start_date', type: 'date', label: 'Project Start', position: { x: 30, y: 220 }, required: true },
      { id: 'end_date', type: 'date', label: 'Project End', position: { x: 280, y: 220 }, required: false },
      { id: 'terms_agree', type: 'checkbox', label: 'Terms & Conditions', position: { x: 30, y: 320 }, required: true },
      { id: 'client_sign', type: 'signature', label: 'Client Signature', position: { x: 30, y: 420 }, required: true },
    ],
  },
  {
    name: 'Non-Disclosure Agreement',
    description: 'Confidentiality agreement to protect sensitive information',
    fields: [
      { id: 'party1_name', type: 'text', label: 'Disclosing Party', position: { x: 30, y: 20 }, required: true },
      { id: 'party2_name', type: 'text', label: 'Receiving Party', position: { x: 280, y: 20 }, required: true },
      { id: 'effective_date', type: 'date', label: 'Effective Date', position: { x: 30, y: 120 }, required: true },
      { id: 'duration', type: 'text', label: 'Duration (years)', position: { x: 280, y: 120 }, required: true },
      { id: 'confidential_info', type: 'text', label: 'Confidential Material', position: { x: 30, y: 220 }, required: true },
      { id: 'nda_agree', type: 'checkbox', label: 'I agree to keep all information confidential', position: { x: 30, y: 320 }, required: true },
      { id: 'party1_sign', type: 'signature', label: 'Disclosing Party Signature', position: { x: 30, y: 420 }, required: true },
      { id: 'party2_sign', type: 'signature', label: 'Receiving Party Signature', position: { x: 280, y: 420 }, required: true },
    ],
  },
  {
    name: 'Freelancer Agreement',
    description: 'Contract for independent contractor/freelancer services',
    fields: [
      { id: 'freelancer_name', type: 'text', label: 'Freelancer Name', position: { x: 30, y: 20 }, required: true },
      { id: 'company_name', type: 'text', label: 'Company Name', position: { x: 280, y: 20 }, required: true },
      { id: 'service_desc', type: 'text', label: 'Services Description', position: { x: 30, y: 120 }, required: true },
      { id: 'hourly_rate', type: 'text', label: 'Hourly Rate ($)', position: { x: 280, y: 120 }, required: true },
      { id: 'start_date', type: 'date', label: 'Start Date', position: { x: 30, y: 220 }, required: true },
      { id: 'end_date', type: 'date', label: 'End Date', position: { x: 280, y: 220 }, required: false },
      { id: 'ip_transfer', type: 'checkbox', label: 'IP Rights Transfer', position: { x: 30, y: 320 }, required: true },
      { id: 'freelancer_sign', type: 'signature', label: 'Freelancer Signature', position: { x: 30, y: 420 }, required: true },
      { id: 'company_sign', type: 'signature', label: 'Company Signature', position: { x: 280, y: 420 }, required: true },
    ],
  },
  {
    name: 'Rental Agreement',
    description: 'Property lease agreement between landlord and tenant',
    fields: [
      { id: 'landlord_name', type: 'text', label: 'Landlord Name', position: { x: 30, y: 20 }, required: true },
      { id: 'tenant_name', type: 'text', label: 'Tenant Name', position: { x: 280, y: 20 }, required: true },
      { id: 'property_address', type: 'text', label: 'Property Address', position: { x: 30, y: 120 }, required: true },
      { id: 'monthly_rent', type: 'text', label: 'Monthly Rent ($)', position: { x: 280, y: 120 }, required: true },
      { id: 'lease_start', type: 'date', label: 'Lease Start', position: { x: 30, y: 220 }, required: true },
      { id: 'lease_end', type: 'date', label: 'Lease End', position: { x: 280, y: 220 }, required: true },
      { id: 'deposit', type: 'text', label: 'Security Deposit ($)', position: { x: 30, y: 320 }, required: true },
      { id: 'terms_agree', type: 'checkbox', label: 'Agree to Terms & Rules', position: { x: 280, y: 320 }, required: true },
      { id: 'landlord_sign', type: 'signature', label: 'Landlord Signature', position: { x: 30, y: 420 }, required: true },
      { id: 'tenant_sign', type: 'signature', label: 'Tenant Signature', position: { x: 280, y: 420 }, required: true },
    ],
  },
  {
    name: 'Sales Agreement',
    description: 'Contract for the sale of goods or products',
    fields: [
      { id: 'seller_name', type: 'text', label: 'Seller Name', position: { x: 30, y: 20 }, required: true },
      { id: 'buyer_name', type: 'text', label: 'Buyer Name', position: { x: 280, y: 20 }, required: true },
      { id: 'product_desc', type: 'text', label: 'Product Description', position: { x: 30, y: 120 }, required: true },
      { id: 'quantity', type: 'text', label: 'Quantity', position: { x: 280, y: 120 }, required: true },
      { id: 'total_price', type: 'text', label: 'Total Price ($)', position: { x: 30, y: 220 }, required: true },
      { id: 'delivery_date', type: 'date', label: 'Delivery Date', position: { x: 280, y: 220 }, required: true },
      { id: 'warranty', type: 'checkbox', label: 'Warranty Included', position: { x: 30, y: 320 }, required: false },
      { id: 'seller_sign', type: 'signature', label: 'Seller Signature', position: { x: 30, y: 420 }, required: true },
      { id: 'buyer_sign', type: 'signature', label: 'Buyer Signature', position: { x: 280, y: 420 }, required: true },
    ],
  },
];

interface AppState {
  blueprints: Blueprint[];
  contracts: Contract[];
  initialized: boolean;
  
  // Init action
  initializeDefaults: () => void;
  
  // Blueprint actions
  addBlueprint: (blueprint: Omit<Blueprint, 'id' | 'createdAt' | 'updatedAt'>) => Blueprint;
  updateBlueprint: (id: string, updates: Partial<Blueprint>) => void;
  deleteBlueprint: (id: string) => void;
  getBlueprintById: (id: string) => Blueprint | undefined;
  
  // Contract actions
  createContract: (name: string, blueprintId: string) => Contract | null;
  updateContractFields: (id: string, fieldValues: ContractFieldValue[]) => void;
  advanceContractStatus: (id: string) => boolean;
  revokeContract: (id: string) => boolean;
  deleteContract: (id: string) => void;
  getContractById: (id: string) => Contract | undefined;
  getContractsByStatus: (status: ContractStatus | 'active' | 'pending' | 'all') => Contract[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      blueprints: [],
      contracts: [],
      initialized: false,

      initializeDefaults: () => {
        const state = get();
        if (state.initialized || state.blueprints.length > 0) return;
        
        const now = new Date().toISOString();
        const blueprintsWithIds = defaultBlueprints.map((bp) => ({
          ...bp,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        }));
        
        set({ blueprints: blueprintsWithIds, initialized: true });
      },

      addBlueprint: (blueprintData) => {
        const now = new Date().toISOString();
        const newBlueprint: Blueprint = {
          ...blueprintData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          blueprints: [...state.blueprints, newBlueprint],
        }));
        return newBlueprint;
      },

      updateBlueprint: (id, updates) => {
        set((state) => ({
          blueprints: state.blueprints.map((bp) =>
            bp.id === id
              ? { ...bp, ...updates, updatedAt: new Date().toISOString() }
              : bp
          ),
        }));
      },

      deleteBlueprint: (id) => {
        set((state) => ({
          blueprints: state.blueprints.filter((bp) => bp.id !== id),
        }));
      },

      getBlueprintById: (id) => {
        return get().blueprints.find((bp) => bp.id === id);
      },

      createContract: (name, blueprintId) => {
        const blueprint = get().getBlueprintById(blueprintId);
        if (!blueprint) return null;

        const now = new Date().toISOString();
        const newContract: Contract = {
          id: generateId(),
          name,
          blueprintId,
          blueprintName: blueprint.name,
          status: 'created',
          fieldValues: blueprint.fields.map((field) => ({
            fieldId: field.id,
            value: field.type === 'checkbox' ? false : '',
          })),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          contracts: [...state.contracts, newContract],
        }));
        return newContract;
      },

      updateContractFields: (id, fieldValues) => {
        set((state) => ({
          contracts: state.contracts.map((contract) =>
            contract.id === id && contract.status !== 'locked' && contract.status !== 'revoked'
              ? { ...contract, fieldValues, updatedAt: new Date().toISOString() }
              : contract
          ),
        }));
      },

      advanceContractStatus: (id) => {
        const contract = get().getContractById(id);
        if (!contract) return false;
        
        const nextStatus = getNextStatus(contract.status);
        if (!nextStatus) return false;

        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id
              ? { ...c, status: nextStatus, updatedAt: new Date().toISOString() }
              : c
          ),
        }));
        return true;
      },

      revokeContract: (id) => {
        const contract = get().getContractById(id);
        if (!contract || !canRevoke(contract.status)) return false;

        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id
              ? { ...c, status: 'revoked' as ContractStatus, updatedAt: new Date().toISOString() }
              : c
          ),
        }));
        return true;
      },

      deleteContract: (id) => {
        set((state) => ({
          contracts: state.contracts.filter((c) => c.id !== id),
        }));
      },

      getContractById: (id) => {
        return get().contracts.find((c) => c.id === id);
      },

      getContractsByStatus: (statusFilter) => {
        const contracts = get().contracts;
        
        switch (statusFilter) {
          case 'all':
            return contracts;
          case 'active':
            return contracts.filter((c) => 
              c.status !== 'locked' && c.status !== 'revoked'
            );
          case 'pending':
            return contracts.filter((c) => 
              c.status === 'created' || c.status === 'approved' || c.status === 'sent'
            );
          default:
            return contracts.filter((c) => c.status === statusFilter);
        }
      },
    }),
    {
      name: 'contract-management-storage',
    }
  )
);
