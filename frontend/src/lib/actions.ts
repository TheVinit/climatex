import { toast } from 'sonner';

// Farmer Actions
export const farmerActions = {
  viewCropCalendar: async (district?: string) => {
    toast.success('Opening crop calendar...');
    console.log('View crop calendar');
  },

  emergencyContacts: async (district?: string) => {
    const contacts = [
      { name: 'District Horticulture Officer', phone: '+91-XXXX-XXXX-XX' },
      { name: 'ATMA (Agricultural Technology Management)', phone: '+91-XXXX-XXXX-XX' },
      { name: 'Disaster Management Authority', phone: '+91-XXXX-XXXX-XX' },
    ];
    toast.info(`Emergency Contacts: ${contacts.map(c => `${c.name} (${c.phone})`).join(', ')}`);
  },

  marketPrices: async (district?: string) => {
    toast.success('Fetching current market prices...');
  },

  downloadAdvisory: async (district: string, hazard: string) => {
    toast.success(`Downloading advisory for ${district} - ${hazard}`);
  },

  getAdvisory: async () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Interrogating Neural Climate Models...',
        success: 'AI Advisory Generated Successfully',
        error: 'Model Timeout'
      }
    );
  },

  toggleLive: async () => {
    toast.success('Satellite Live Sync Toggled');
  }
};

// Insurance Actions
export const insurerActions = {
  processClaims: async () => {
    toast.success('Opening claims processing portal...');
  },

  generateRiskReport: async (district: string) => {
    toast.loading('Generating risk report...');
    setTimeout(() => toast.success(`Risk report generated for ${district}`), 1500);
  },

  exportPayoutData: async () => {
    toast.success('Exporting payout data to CSV...');
  },

  managePolicy: async (policyId: string) => {
    toast.info(`Managing policy ${policyId}`);
  },

  triggerPayout: async () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2500)),
      {
        loading: 'Executing Smart Contract Triggers...',
        success: 'Automated Payouts Initiated',
        error: 'Execution Failed'
      }
    );
  },

  viewAnalytics: async () => {
    toast.info('Opening Advanced Actuarial Analytics...');
  }
};

// NABARD Actions
export const nabardActions = {
  adjustLimits: async (district: string, newLimit: number) => {
    toast.success(`Adjusting KCC limit for ${district} to ₹${newLimit.toLocaleString()}`);
  },

  generateRiskReport: async (district: string) => {
    toast.loading('Generating credit risk report...');
    setTimeout(() => toast.success(`Credit risk report ready for ${district}`), 1500);
  },

  reviewPortfolio: async () => {
    toast.info('Opening portfolio review dashboard...');
  },

  flagForReview: async (district: string, reason: string) => {
    toast.warning(`Flagged ${district} for review: ${reason}`);
  },

  checkCredit: async () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Assessing District Liquidity Spikes...',
        success: 'Credit Sustainability Audit Complete',
        error: 'Audit Failed'
      }
    );
  },

  viewReport: async () => {
    toast.info('Opening Comprehensive Credit Intelligence Report...');
  }
};

// Supplier Actions
export const supplierActions = {
  stockSeeds: async (crop: string, quantity: number) => {
    toast.success(`Stocking ${quantity} kg of ${crop}`);
  },

  forecastDemand: async (district: string) => {
    toast.loading('Forecasting seed demand...');
    setTimeout(() => toast.success(`Demand forecast ready for ${district}`), 1500);
  },

  planDistribution: async (route: string) => {
    toast.info(`Planning distribution route: ${route}`);
  },

  viewInventory: async () => {
    toast.info('Opening inventory management...');
  },

  checkStock: async () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1800)),
      {
        loading: 'Balancing Inventory Nodes...',
        success: 'Stock Levels Optimized for Hazard Window',
        error: 'Sync Failed'
      }
    );
  },

  viewHistory: async () => {
    toast.info('Opening Dispatch & Logistics History...');
  }
};

// Global Actions
export const globalActions = {
  downloadData: async (format: 'csv' | 'pdf' | 'json', data: unknown) => {
    toast.success(`Downloading ${format.toUpperCase()}...`);
  },

  shareReport: async (link: string) => {
    await navigator.clipboard.writeText(link);
    toast.success('Report link copied to clipboard!');
  },

  printPage: async () => {
    window.print();
    toast.info('Print dialog opened');
  },

  sendAlert: async (recipient: string, message: string) => {
    toast.success(`Alert sent to ${recipient}`);
  },
};
