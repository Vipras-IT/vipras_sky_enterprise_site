export const superAdminRoutes = [
  {
    label: 'My Activity',
    labelDisable: true,
    children: [
      {
        name: 'Your Attendance Reports',
        to: '/your-attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Your Manual Attendance Report',
        to: '/your-manual-attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Add Transaction',
        to: '/imprestholder-Transaction',
        exact: true,
        active: true,
      },
      {
        name: 'Transaction List',
        to: '/impress-list',
        exact: true,
        active: true,
      },
      {
        name: 'Pending Transaction List',
        to: '/pending-impress-list',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Enrollment',
    labelDisable: true,
    children: [
      {
        name: 'Registration',
        to: '/registration',
        active: true,
      },
      {
        name: 'Employee Verification Pending',
        to: '/pending-verification',
        exact: true,
        active: true,
      },
      {
        name: 'Employee Report',
        to: '/employeeList',
        exact: true,
        active: true,
      },
      {
        name: 'User ID Creation',
        to: '/addlist',
        exact: true,
        active: true,
      },
      {
        name: 'User ID List',
        to: '/listuser',
        active: true,
      },
      {
        name: 'Access Menu',
        to: '/accessmenu',
        active: true,
      },
    ],
  },
  {
    label: 'Site',
    labelDisable: true,
    children: [
      {
        name: 'Site Creation',
        to: '/sitecreation',
        active: true,
      },
      {
        name: 'Site List',
        to: '/sitelist',
        exact: true,
        active: true,
      },
      {
        name: 'Shift Schedule operation',
        to: '/site-shiftschedule',
        exact: true,
        active: true,
      },
      {
        name: 'DMR Report',
        to: '/dmr-report',
        exact: true,
        active: true,
      },
      {
        name: 'Pending DMR Report',
        to: '/dmr-fm-report',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Attendance',
    labelDisable: true,
    children: [
      {
        name: 'Attendance report',
        to: '/attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Check In / Out Attendance',
        to: '/attendance',
        active: true,
      },
      {
        name: 'Shift schedule',
        to: '/shiftschedule',
        active: true,
      },
      {
        name: 'Manual Attendance Report',
        to: '/manual-attendance-report',
        active: true,
      },
      {
        name: 'Update Attendance',
        to: '/update-attendance',
        active: true,
      },
      {
        name: 'Bulk Attendance',
        to: '/bulk-attendance',
        active: true,
      },
      {
        name: 'Bulk Attendance Report',
        to: '/bulk-attendance-report',
        active: true,
      },
      {
        name: 'Site Atten Report',
        to: '/site-attendance-report',
        active: true,
      },
      {
        name: 'Site Atten Report by Emp',
        to: '/site-attendance-employee',
        active: true,
      },
    ],
  },
  {
    label: 'Reports',
    labelDisable: true,
    children: [
      {
        name: 'Generate Report',
        to: '/generatereport',
        active: true,
      },
      {
        name: 'Salary Report',
        to: '/salaryreport',
        active: true,
      },
      {
        name: 'Clubed Salary Report',
        to: '/clubedSalaryreport',
        active: true,
      },
      {
        name: 'InActive Salary Report',
        to: '/inactive-employe-salaryreport',
        active: true,
      },
      {
        name: 'Invoice Report',
        to: '/gstinvoice-report',
        active: true,
      },
      // {
      //   name: 'Sub Contracter Invoice Report',
      //   to: '/sub-contracter-invoice-report',
      //   active: true
      // },
      {
        name: 'Create Manual Invoice',
        to: '/create-manual-invoice',
        active: true,
      },
      {
        name: 'Invoice Daily Breakup',
        to: '/daily-breakup',
        active: true,
      },
      {
        name: 'Invoice Monthly Breakup',
        to: '/monthly-breakup',
        active: true,
      },
      {
        name: 'Site Expenses Report',
        to: '/site-expenses-report',
        active: true,
      },
      {
        name: 'Imprest Expenses Report',
        to: '/imprest-expenses-report',
        active: true,
      },
      {
        name: 'Collection-Expenses Reconciliation',
        to: '/collection-expenses',
        active: true,
      },
      // {
      //   name: 'Sub-Contractor Report',
      //   to: '/sub-contaracter',
      //   active: true
      // },
      {
        name: 'OutStanding Report',
        to: '/outstanding-list',
        active: true,
      },
      {
        name: 'Profit & Loss Report',
        to: '/profit-loss',
        active: true,
      },
      {
        name: 'Site Profit & Loss Report',
        to: '/site-wise-pl-report',
        active: true,
      },
      {
        name: 'Gross Profit & Loss Report',
        to: '/gross-profit-loss',
        active: true,
      },
      {
        name: 'Department Profit & Loss Report',
        to: '/department-profit-loss',
        active: true,
      },
      {
        name: 'HK Consumable',
        to: '/hkconsumableComparision',
        active: true,
      },
      {
        name: 'Over Head',
        to: '/overhead-calculation',
        active: true,
      },
      {
        name: 'Admin Comparison',
        to: '/admin-comparison',
        active: true,
      },
    ],
  },
  {
    label: 'Sub Contractor',
    labelDisable: true,
    children: [
      {
        name: 'Sub-Contractor Transaction',
        to: '/subcontractorTransaction',
        exact: true,
        active: true,
      },
      {
        name: 'Sub-Contractor Transaction List',
        to: '/subcontractorTransactionList',
        exact: true,
        active: true,
      },
      {
        name: 'Sub-Contractor Invoice Report',
        to: '/sub-contracter-invoice-report',
        active: true,
      },
      {
        name: 'Sub-Contractor Report',
        to: '/sub-contaracter',
        active: true,
      },
      {
        name: 'Generate Sub-Contractor Report',
        to: '/sub-contaracter-report',
        active: true,
      },
      {
        name: 'Sub-Contractor Outstanding',
        to: '/sub-contractor-outstanding-list',
        active: true,
      },
      {
        name: 'Monthly Sub-Contractor list',
        to: '/sub-contractor-monthly',
        active: true,
      },
    ],
  },
  {
    label: 'Store',
    labelDisable: true,
    children: [
      {
        name: 'StockMaintenance',
        to: '/stockmaintenance',
        exact: true,
        active: true,
      },
      {
        name: 'Sale',
        to: '/sale',
        exact: true,
        active: true,
      },
      {
        name: 'Salesdetails',
        to: '/salesdetails',
        active: true,
      },
      {
        name: 'Sale Return',
        to: '/saleReturn',
        exact: true,
        active: true,
      },
      {
        name: 'Sale Return Details',
        to: '/saleReturnDetails',
        exact: true,
        active: true,
      },
      {
        name: 'Purchase',
        to: '/purchase',
        exact: true,
        active: true,
      },
      {
        name: 'PurchaseDetails',
        to: '/purchasedetails',
        active: true,
      },
      {
        name: 'AssetMovementRegister',
        to: '/asset-movement-register',
        active: true,
      },
      {
        name: 'AssetMovementRegisterList',
        to: '/asset-movement-register-list',
        active: true,
      },
      {
        name: 'StoreVendor Report',
        to: '/storevendor-report',
        active: true,
      },
    ],
  },
  {
    label: 'Accounts',
    labelDisable: true,
    children: [
      {
        name: 'Accounts Transaction',
        to: '/imprestholder-credit',
        exact: true,
        active: true,
      },
      {
        name: 'Accounts Transaction List',
        to: '/imprestholder-creditlist',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Imprest Holder',
    labelDisable: true,
    children: [
      // {
      //   name: 'SubContractor Transaction',
      //   to: '/subcontractorTransaction',
      //   exact: true,
      //   active: true
      // },
      // {
      //   name: 'SubContractor Transaction List',
      //   to: '/subcontractorTransactionList',
      //   exact: true,
      //   active: true
      // },
      {
        name: 'Other Deductions',
        to: '/other-deductions',
        exact: true,
        active: true,
      },
      {
        name: 'Other Deductions List',
        to: '/other-deductions-list',
        exact: true,
        active: true,
      },
      // {
      //   name: 'Imprest Holder Transaction',
      //   to: '/imprestholder-Transaction',
      //   exact: true,
      //   active: true
      // },
      {
        name: 'Imprest Holder Transaction List',
        to: '/imprestholder-transaction-list',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Tickets',
    labelDisable: true,
    children: [
      {
        name: 'Internal Ticket',
        to: '/internal-tickets-list',
        exact: true,
        active: true,
      },
      {
        name: 'External Ticket',
        to: '/external-list',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket List',
        to: '/leadlistform',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket Creation',
        to: '/leadgeneration',
        active: true,
      },
    ],
  },
  {
    label: 'Master Data',
    labelDisable: true,
    children: [
      {
        name: 'Add New Product',
        to: '/addproduct',
        exact: true,
        active: true,
      },
      {
        name: 'Product List',
        to: '/productlist',
        exact: true,
        active: true,
      },
      {
        name: 'Add New Rental Rooms',
        to: '/add-new-rental-rooms',
        exact: true,
        active: true,
      },
      {
        name: 'Rental Rooms List',
        to: '/rental-rooms-list',
        exact: true,
        active: true,
      },
      {
        name: 'Add Vendor',
        to: '/add-new-vendor',
        exact: true,
        active: true,
      },
      {
        name: 'Vendor List',
        to: '/vendor-list',
        exact: true,
        active: true,
      },
      {
        name: 'Documents',
        to: '/adddocument',
        exact: true,
        active: true,
      },
      {
        name: 'Notifications',
        to: '/addnotifications',
        exact: true,
        active: true,
      },
      {
        name: 'Add Role',
        to: '/addrole',
        exact: true,
        active: true,
      },
      {
        name: 'Role List',
        to: '/role-list',
        exact: true,
        active: true,
      },
      {
        name: 'Add Expenses',
        to: '/addexpenses',
        exact: true,
        active: true,
      },
    ],
  },
];

export const adminRoutes = [
  {
    label: 'My Activity',
    labelDisable: true,
    children: [
      {
        name: 'Your Attendance Reports',
        to: '/your-attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Your Manual Attendance Report',
        to: '/your-manual-attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Add Transaction',
        to: '/imprestholder-Transaction',
        exact: true,
        active: true,
      },
      {
        name: 'Transaction List',
        to: '/impress-list',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Enrollment',
    labelDisable: true,
    children: [
      {
        name: 'Registration',
        to: '/registration',
        active: true,
      },

      // {
      //   name: 'Employee Report',
      //   to: '/employeeList',
      //   exact: true,
      //   active: true
      // }
    ],
  },
  {
    label: 'Site',
    labelDisable: true,
    children: [
      {
        name: 'Site Creation',
        to: '/sitecreation',
        active: true,
      },
      {
        name: 'Site List',
        to: '/sitelist',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Attendance',
    labelDisable: true,
    children: [
      {
        name: 'Attendance report',
        to: '/attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Check In / Out Attendance',
        to: '/attendance',
        active: true,
      },
      {
        name: 'Shift schedule',
        to: '/shiftschedule',
        active: true,
      },
      {
        name: 'Manual Attendance Report',
        to: '/manual-attendance-report',
        active: true,
      },
      {
        name: 'Update Attendance',
        to: '/update-attendance',
        active: true,
      },
    ],
  },
  {
    label: 'Reports',
    labelDisable: true,
    children: [
      {
        name: 'Salary Report',
        to: '/salaryreport',
        active: true,
      },
    ],
  },
  {
    label: 'Store',
    labelDisable: true,
    children: [
      {
        name: 'StockMaintenance',
        to: '/stockmaintenance',
        exact: true,
        active: true,
      },
      {
        name: 'Sale',
        to: '/sale',
        exact: true,
        active: true,
      },
      {
        name: 'Salesdetails',
        to: '/salesdetails',
        active: true,
      },
      {
        name: 'Sale Return',
        to: '/saleReturn',
        exact: true,
        active: true,
      },
      {
        name: 'Sale Return Details',
        to: '/saleReturnDetails',
        exact: true,
        active: true,
      },
      {
        name: 'PurchaseDetails',
        to: '/purchasedetails',
        active: true,
      },
      {
        name: 'AssetMovementRegisterList',
        to: '/asset-movement-register-list',
        active: true,
      },
      {
        name: 'StoreVendor Report',
        to: '/storevendor-report',
        active: true,
      },
    ],
  },
  {
    label: 'Imprest Holder',
    labelDisable: true,
    children: [
      // {
      //   name: 'SubContractor Transaction',
      //   to: '/subcontractorTransaction',
      //   exact: true,
      //   active: true
      // },
      // {
      //   name: 'SubContractor Transaction List',
      //   to: '/subcontractorTransactionList',
      //   exact: true,
      //   active: true
      // },
      {
        name: 'Other Deductions List',
        to: '/other-deductions-list',
        exact: true,
        active: true,
      },
      {
        name: 'Imprest Holder Transaction',
        to: '/imprestholder-Transaction',
        exact: true,
        active: true,
      },
      {
        name: 'Imprest Holder Transaction List',
        to: '/imprestholder-transaction-list',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Tickets',
    labelDisable: true,
    children: [
      {
        name: 'Internal Ticket',
        to: '/internal-tickets-list',
        exact: true,
        active: true,
      },
      {
        name: 'External Ticket',
        to: '/external-list',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket List',
        to: '/leadlistform',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket Creation',
        to: '/leadgeneration',
        active: true,
      },
    ],
  },
  {
    label: 'Master Data',
    labelDisable: true,
    children: [
      {
        name: 'Add New Product',
        to: '/addproduct',
        exact: true,
        active: true,
      },
      {
        name: 'Product List',
        to: '/productlist',
        exact: true,
        active: true,
      },
      {
        name: 'Add New Rental Rooms',
        to: '/add-new-rental-rooms',
        exact: true,
        active: true,
      },
      {
        name: 'Rental Rooms List',
        to: '/rental-rooms-list',
        exact: true,
        active: true,
      },
      {
        name: 'Add Vendor',
        to: '/add-new-vendor',
        exact: true,
        active: true,
      },
      {
        name: 'Vendor List',
        to: '/vendor-list',
        exact: true,
        active: true,
      },
      {
        name: 'Documents',
        to: '/adddocument',
        exact: true,
        active: true,
      },
    ],
  },
];

export const hrRoutes = [
  {
    label: 'Enrollment',
    labelDisable: true,
    children: [
      {
        name: 'Registration',
        to: '/registration',
        active: true,
      },
      // {
      //   name: 'Employee Report',
      //   to: '/employeeList',
      //   exact: true,
      //   active: true
      // }
    ],
  },
  {
    label: 'Site',
    labelDisable: true,
    children: [
      {
        name: 'Site Creation',
        to: '/sitecreation',
        active: true,
      },
      {
        name: 'Site List',
        to: '/sitelist',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Attendance',
    labelDisable: true,
    children: [
      {
        name: 'Attendance report',
        to: '/attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Check In / Out Attendance',
        to: '/attendance',
        active: true,
      },
      {
        name: 'Shift schedule',
        to: '/shiftschedule',
        active: true,
      },
      {
        name: 'Manual Attendance Report',
        to: '/manual-attendance-report',
        active: true,
      },
      {
        name: 'Update Attendance',
        to: '/update-attendance',
        active: true,
      },
      {
        name: 'Bulk Attendance',
        to: '/bulk-attendance',
        active: true,
      },
      {
        name: 'Bulk Attendance Report',
        to: '/bulk-attendance-report',
        active: true,
      },
    ],
  },
  {
    label: 'Reports',
    labelDisable: true,
    children: [
      {
        name: 'Salary Report',
        to: '/salaryreport',
        active: true,
      },
    ],
  },
  {
    label: 'Imprest Holder',
    labelDisable: true,
    children: [
      {
        name: 'Other Deductions',
        to: '/other-deductions',
        exact: true,
        active: true,
      },
      {
        name: 'Other Deductions List',
        to: '/other-deductions-list',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Tickets',
    labelDisable: true,
    children: [
      {
        name: 'Internal Ticket',
        to: '/internal-tickets-list',
        exact: true,
        active: true,
      },
      {
        name: 'External Ticket',
        to: '/external-list',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket List',
        to: '/leadlistform',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket Creation',
        to: '/leadgeneration',
        active: true,
      },
    ],
  },
  {
    label: 'Document',
    labelDisable: true,
    children: [
      {
        name: 'Add Document',
        to: '/adddocument',
        exact: true,
        active: true,
      },
    ],
  },
];

export const accountManagerRoutes = [
  // {
  //   label: 'Enrollment',
  //   labelDisable: true,
  //   children: [
  //     {
  //       name: 'Employee Report',
  //       to: '/employeeList',
  //       exact: true,
  //       active: true
  //     }
  //   ]
  // },
  {
    label: 'Site',
    labelDisable: true,
    children: [
      {
        name: 'Site List',
        to: '/sitelist',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Attendance',
    labelDisable: true,
    children: [
      {
        name: 'Attendance report',
        to: '/attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Manual Attendance Report',
        to: '/manual-attendance-report',
        active: true,
      },
    ],
  },
  {
    label: 'Reports',
    labelDisable: true,
    children: [
      {
        name: 'Salary Report',
        to: '/salaryreport',
        active: true,
      },
    ],
  },
  {
    label: 'Store',
    labelDisable: true,
    children: [
      {
        name: 'Salesdetails',
        to: '/salesdetails',
        active: true,
      },
      {
        name: 'Sale Return Details',
        to: '/saleReturnDetails',
        exact: true,
        active: true,
      },
      {
        name: 'PurchaseDetails',
        to: '/purchasedetails',
        active: true,
      },
      {
        name: 'StoreVendor Report',
        to: '/storevendor-report',
        active: true,
      },
    ],
  },
  {
    label: 'Accounts',
    labelDisable: true,
    children: [
      {
        name: 'Accounts Transaction',
        to: '/imprestholder-credit',
        exact: true,
        active: true,
      },
      {
        name: 'Accounts Transaction List',
        to: '/imprestholder-creditlist',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Imprest Holder',
    labelDisable: true,
    children: [
      {
        name: 'Other Deductions List',
        to: '/other-deductions-list',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Tickets',
    labelDisable: true,
    children: [
      {
        name: 'Internal Ticket',
        to: '/internal-tickets-list',
        exact: true,
        active: true,
      },
      {
        name: 'External Ticket',
        to: '/external-list',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket List',
        to: '/leadlistform',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket Creation',
        to: '/leadgeneration',
        active: true,
      },
    ],
  },
  {
    label: 'Master Data',
    labelDisable: true,
    children: [
      {
        name: 'Rental Rooms List',
        to: '/rental-rooms-list',
        exact: true,
        active: true,
      },
      {
        name: 'Add Vendor',
        to: '/add-new-vendor',
        exact: true,
        active: true,
      },
      {
        name: 'Vendor List',
        to: '/vendor-list',
        exact: true,
        active: true,
      },
      {
        name: 'Documents',
        to: '/adddocument',
        exact: true,
        active: true,
      },
    ],
  },
];

export const accountAssistantRoutes = [
  // {
  //   label: 'Enrollment',
  //   labelDisable: true,
  //   children: [
  //     {
  //       name: 'Employee Report',
  //       to: '/employeeList',
  //       exact: true,
  //       active: true
  //     }
  //   ]
  // },
  {
    label: 'Site',
    labelDisable: true,
    children: [
      {
        name: 'Site List',
        to: '/sitelist',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Attendance',
    labelDisable: true,
    children: [
      {
        name: 'Attendance report',
        to: '/attendance-report',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Reports',
    labelDisable: true,
    children: [
      {
        name: 'Salary Report',
        to: '/salaryreport',
        active: true,
      },
    ],
  },
  {
    label: 'Store',
    labelDisable: true,
    children: [
      {
        name: 'StoreVendor Report',
        to: '/storevendor-report',
        active: true,
      },
    ],
  },
  {
    label: 'Accounts',
    labelDisable: true,
    children: [
      {
        name: 'Accounts Transaction',
        to: '/imprestholder-credit',
        exact: true,
        active: true,
      },
      {
        name: 'Accounts Transaction List',
        to: '/imprestholder-creditlist',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Imprest Holder',
    labelDisable: true,
    children: [
      {
        name: 'Other Deductions List',
        to: '/other-deductions-list',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Tickets',
    labelDisable: true,
    children: [
      {
        name: 'Internal Ticket',
        to: '/internal-tickets-list',
        exact: true,
        active: true,
      },
      {
        name: 'External Ticket',
        to: '/external-list',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket List',
        to: '/leadlistform',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket Creation',
        to: '/leadgeneration',
        active: true,
      },
    ],
  },
  {
    label: 'Master Data',
    labelDisable: true,
    children: [
      {
        name: 'Add New Product',
        to: '/addproduct',
        exact: true,
        active: true,
      },
      {
        name: 'Product List',
        to: '/productlist',
        exact: true,
        active: true,
      },
      {
        name: 'Add New Rental Rooms',
        to: '/add-new-rental-rooms',
        exact: true,
        active: true,
      },
      {
        name: 'Rental Rooms List',
        to: '/rental-rooms-list',
        exact: true,
        active: true,
      },
      {
        name: 'Vendor List',
        to: '/vendor-list',
        exact: true,
        active: true,
      },
      {
        name: 'Documents',
        to: '/adddocument',
        exact: true,
        active: true,
      },
    ],
  },
];

export const crmRoutes = [
  {
    label: 'Enrollment',
    labelDisable: true,
    children: [
      {
        name: 'Registration',
        to: '/registration',
        active: true,
      },
      // {
      //   name: 'Employee Report',
      //   to: '/employeeList',
      //   exact: true,
      //   active: true
      // }
    ],
  },
  {
    label: 'Site',
    labelDisable: true,
    children: [
      {
        name: 'Site Creation',
        to: '/sitecreation',
        active: true,
      },
      {
        name: 'Site List',
        to: '/sitelist',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Attendance',
    labelDisable: true,
    children: [
      {
        name: 'Attendance report',
        to: '/attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Check In / Out Attendance',
        to: '/attendance',
        active: true,
      },
      {
        name: 'Shift schedule',
        to: '/shiftschedule',
        active: true,
      },
      {
        name: 'Manual Attendance Report',
        to: '/manual-attendance-report',
        active: true,
      },
      {
        name: 'Update Attendance',
        to: '/update-attendance',
        active: true,
      },
    ],
  },
  {
    label: 'Reports',
    labelDisable: true,
    children: [
      {
        name: 'Salary Report',
        to: '/salaryreport',
        active: true,
      },
    ],
  },
  {
    label: 'Store',
    labelDisable: true,
    children: [
      {
        name: 'Purchase',
        to: '/purchase',
        exact: true,
        active: true,
      },
      {
        name: 'PurchaseDetails',
        to: '/purchasedetails',
        active: true,
      },
      {
        name: 'AssetMovementRegister',
        to: '/asset-movement-register',
        active: true,
      },
      {
        name: 'AssetMovementRegisterList',
        to: '/asset-movement-register-list',
        active: true,
      },
    ],
  },
  {
    label: 'Tickets',
    labelDisable: true,
    children: [
      {
        name: 'Internal Ticket',
        to: '/internal-tickets-list',
        exact: true,
        active: true,
      },
      {
        name: 'External Ticket',
        to: '/external-list',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket List',
        to: '/leadlistform',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket Creation',
        to: '/leadgeneration',
        active: true,
      },
    ],
  },
  {
    label: 'Master Data',
    labelDisable: true,
    children: [
      {
        name: 'Product List',
        to: '/productlist',
        exact: true,
        active: true,
      },
      {
        name: 'Add New Rental Rooms',
        to: '/add-new-rental-rooms',
        exact: true,
        active: true,
      },
      {
        name: 'Rental Rooms List',
        to: '/rental-rooms-list',
        exact: true,
        active: true,
      },
      {
        name: 'Add Vendor',
        to: '/add-new-vendor',
        exact: true,
        active: true,
      },
      {
        name: 'Vendor List',
        to: '/vendor-list',
        exact: true,
        active: true,
      },
      {
        name: 'Documents',
        to: '/adddocument',
        exact: true,
        active: true,
      },
    ],
  },
];

export const crmAssistantRoutes = [
  {
    label: 'Enrollment',
    labelDisable: true,
    children: [
      {
        name: 'Registration',
        to: '/registration',
        active: true,
      },
      // {
      //   name: 'Employee Report',
      //   to: '/employeeList',
      //   exact: true,
      //   active: true
      // }
    ],
  },
  {
    label: 'Site',
    labelDisable: true,
    children: [
      {
        name: 'Site Creation',
        to: '/sitecreation',
        active: true,
      },
      {
        name: 'Site List',
        to: '/sitelist',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Attendance',
    labelDisable: true,
    children: [
      {
        name: 'Attendance report',
        to: '/attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Check In / Out Attendance',
        to: '/attendance',
        active: true,
      },
      {
        name: 'Shift schedule',
        to: '/shiftschedule',
        active: true,
      },
      {
        name: 'Manual Attendance Report',
        to: '/manual-attendance-report',
        active: true,
      },
      {
        name: 'Update Attendance',
        to: '/update-attendance',
        active: true,
      },
    ],
  },
  {
    label: 'Reports',
    labelDisable: true,
    children: [
      {
        name: 'Salary Report',
        to: '/salaryreport',
        active: true,
      },
    ],
  },
  {
    label: 'Store',
    labelDisable: true,
    children: [
      {
        name: 'Purchase',
        to: '/purchase',
        exact: true,
        active: true,
      },
      {
        name: 'PurchaseDetails',
        to: '/purchasedetails',
        active: true,
      },
      {
        name: 'AssetMovementRegister',
        to: '/asset-movement-register',
        active: true,
      },
      {
        name: 'AssetMovementRegisterList',
        to: '/asset-movement-register-list',
        active: true,
      },
    ],
  },
  {
    label: 'Tickets',
    labelDisable: true,
    children: [
      {
        name: 'Internal Ticket',
        to: '/internal-tickets-list',
        exact: true,
        active: true,
      },
      {
        name: 'External Ticket',
        to: '/external-list',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket List',
        to: '/leadlistform',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket Creation',
        to: '/leadgeneration',
        active: true,
      },
    ],
  },
  {
    label: 'Master Data',
    labelDisable: true,
    children: [
      {
        name: 'Product List',
        to: '/productlist',
        exact: true,
        active: true,
      },
      {
        name: 'Add New Rental Rooms',
        to: '/add-new-rental-rooms',
        exact: true,
        active: true,
      },
      {
        name: 'Rental Rooms List',
        to: '/rental-rooms-list',
        exact: true,
        active: true,
      },
      {
        name: 'Add Vendor',
        to: '/add-new-vendor',
        exact: true,
        active: true,
      },
      {
        name: 'Vendor List',
        to: '/vendor-list',
        exact: true,
        active: true,
      },
      {
        name: 'Documents',
        to: '/adddocument',
        exact: true,
        active: true,
      },
    ],
  },
];

export const gmOpsRoutes = [
  {
    label: 'Enrollment',
    labelDisable: true,
    children: [
      {
        name: 'Registration',
        to: '/registration',
        active: true,
      },
      {
        name: 'Employee Report',
        to: '/employeeList',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Site',
    labelDisable: true,
    children: [
      {
        name: 'Site Creation',
        to: '/sitecreation',
        active: true,
      },
      {
        name: 'Site List',
        to: '/sitelist',
        exact: true,
        active: true,
      },
      {
        name: 'DMR Report',
        to: '/dmr-report',
        exact: true,
        active: true,
      },
      {
        name: 'Pending DMR Report',
        to: '/dmr-fm-report',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Attendance',
    labelDisable: true,
    children: [
      {
        name: 'Attendance report',
        to: '/attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Check In / Out Attendance',
        to: '/attendance',
        active: true,
      },
      {
        name: 'Shift schedule',
        to: '/shiftschedule',
        active: true,
      },
      {
        name: 'Manual Attendance Report',
        to: '/manual-attendance-report',
        active: true,
      },
      {
        name: 'Update Attendance',
        to: '/update-attendance',
        active: true,
      },
      {
        name: 'Site Atten Report',
        to: '/site-attendance-report',
        active: true,
      },
    ],
  },
  // {
  //   label: 'Reports',
  //   labelDisable: true,
  //   children: [
  //     {
  //       name: 'Salary Report',
  //       to: '/salaryreport',
  //       active: true
  //     }
  //   ]
  // },
  {
    label: 'Store',
    labelDisable: true,
    children: [
      {
        name: 'Purchase',
        to: '/purchase',
        exact: true,
        active: true,
      },
      {
        name: 'AssetMovementRegister',
        to: '/asset-movement-register',
        active: true,
      },
      {
        name: 'AssetMovementRegisterList',
        to: '/asset-movement-register-list',
        active: true,
      },
    ],
  },
  {
    label: 'Tickets',
    labelDisable: true,
    children: [
      {
        name: 'Internal Ticket',
        to: '/internal-tickets-list',
        exact: true,
        active: true,
      },
      {
        name: 'External Ticket',
        to: '/external-list',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket List',
        to: '/leadlistform',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket Creation',
        to: '/leadgeneration',
        active: true,
      },
    ],
  },
  {
    label: 'Master Data',
    labelDisable: true,
    children: [
      {
        name: 'Add New Product',
        to: '/addproduct',
        exact: true,
        active: true,
      },
      {
        name: 'Product List',
        to: '/productlist',
        exact: true,
        active: true,
      },
      {
        name: 'Rental Rooms List',
        to: '/rental-rooms-list',
        exact: true,
        active: true,
      },
      {
        name: 'Documents',
        to: '/adddocument',
        exact: true,
        active: true,
      },
    ],
  },
];

export const fmRoutes = [
  {
    label: 'Enrollment',
    labelDisable: true,
    children: [
      {
        name: 'Registration',
        to: '/registration',
        active: true,
      },
      // {
      //   name: 'Employee Report',
      //   to: '/employeeList',
      //   exact: true,
      //   active: true
      // }
    ],
  },
  {
    label: 'Site',
    labelDisable: true,
    children: [
      // {
      //   name: 'Site Creation',
      //   to: '/sitecreation',
      //   active: true
      // },
      {
        name: 'Site List',
        to: '/sitelist',
        exact: true,
        active: true,
      },
      {
        name: 'Shift Schedule operation',
        to: '/site-shiftschedule',
        exact: true,
        active: true,
      },
      {
        name: 'Dmr Report',
        to: '/dmr-report',
        exact: true,
        active: true,
      },
      {
        name: 'Pending Dmr Report',
        to: '/dmr-fm-report',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Attendance',
    labelDisable: true,
    children: [
      {
        name: 'Attendance report',
        to: '/attendance-report',
        exact: true,
        active: true,
      },
      {
        name: 'Check In / Out Attendance',
        to: '/attendance',
        active: true,
      },
      {
        name: 'Shift schedule',
        to: '/shiftschedule',
        active: true,
      },
      {
        name: 'Manual Attendance Report',
        to: '/manual-attendance-report',
        active: true,
      },
      {
        name: 'Update Attendance',
        to: '/update-attendance',
        active: true,
      },
      {
        name: 'Site Atten Report',
        to: '/site-attendance-report',
        active: true,
      },
      {
        name: 'Site Atten Report by Emp',
        to: '/site-attendance-employee',
        active: true,
      },
    ],
  },
  {
    label: 'Store',
    labelDisable: true,
    children: [
      {
        name: 'AssetMovementRegister',
        to: '/asset-movement-register',
        active: true,
      },
    ],
  },
  {
    label: 'Tickets',
    labelDisable: true,
    children: [
      {
        name: 'Internal Ticket',
        to: '/internal-tickets-list',
        exact: true,
        active: true,
      },
      {
        name: 'External Ticket',
        to: '/external-list',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket List',
        to: '/leadlistform',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket Creation',
        to: '/leadgeneration',
        active: true,
      },
    ],
  },
  {
    label: 'Master Data',
    labelDisable: true,
    children: [
      {
        name: 'Rental Rooms List',
        to: '/rental-rooms-list',
        exact: true,
        active: true,
      },
      {
        name: 'Documents',
        to: '/adddocument',
        exact: true,
        active: true,
      },
    ],
  },
];

export const storeRoutes = [
  {
    label: 'Enrollment',
    labelDisable: true,
    children: [
      {
        name: 'Registration',
        to: '/registration',
        active: true,
      },
      // {
      //   name: 'Employee Report',
      //   to: '/employeeList',
      //   exact: true,
      //   active: true
      // }
    ],
  },
  {
    label: 'Site',
    labelDisable: true,
    children: [
      {
        name: 'Site Creation',
        to: '/sitecreation',
        active: true,
      },
      {
        name: 'Site List',
        to: '/sitelist',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Store',
    labelDisable: true,
    children: [
      {
        name: 'StockMaintenance',
        to: '/stockmaintenance',
        exact: true,
        active: true,
      },
      {
        name: 'Sale',
        to: '/sale',
        exact: true,
        active: true,
      },
      {
        name: 'Salesdetails',
        to: '/salesdetails',
        active: true,
      },
      {
        name: 'Sale Return',
        to: '/saleReturn',
        exact: true,
        active: true,
      },
      {
        name: 'Sale Return Details',
        to: '/saleReturnDetails',
        exact: true,
        active: true,
      },
      {
        name: 'Purchase',
        to: '/purchase',
        exact: true,
        active: true,
      },
      {
        name: 'PurchaseDetails',
        to: '/purchasedetails',
        active: true,
      },
      {
        name: 'AssetMovementRegister',
        to: '/asset-movement-register',
        active: true,
      },
      {
        name: 'AssetMovementRegisterList',
        to: '/asset-movement-register-list',
        active: true,
      },
      {
        name: 'StoreVendor Report',
        to: '/storevendor-report',
        active: true,
      },
    ],
  },
  {
    label: 'Tickets',
    labelDisable: true,
    children: [
      {
        name: 'Internal Ticket',
        to: '/internal-tickets-list',
        exact: true,
        active: true,
      },
      {
        name: 'External Ticket',
        to: '/external-list',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket List',
        to: '/leadlistform',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket Creation',
        to: '/leadgeneration',
        active: true,
      },
    ],
  },
  {
    label: 'Master Data',
    labelDisable: true,
    children: [
      {
        name: 'Add New Product',
        to: '/addproduct',
        exact: true,
        active: true,
      },
      {
        name: 'Product List',
        to: '/productlist',
        exact: true,
        active: true,
      },
      {
        name: 'Add Vendor',
        to: '/add-new-vendor',
        exact: true,
        active: true,
      },
      {
        name: 'Vendor List',
        to: '/vendor-list',
        exact: true,
        active: true,
      },
      {
        name: 'Documents',
        to: '/adddocument',
        exact: true,
        active: true,
      },
      {
        name: 'Documents',
        to: '/adddocument',
        exact: true,
        active: true,
      },
    ],
  },
];

export const viprasMartRoutes = [
  // {
  //   label: 'Enrollment',
  //   labelDisable: true,
  //   children: [
  //     {
  //       name: 'Employee Report',
  //       to: '/employeeList',
  //       exact: true,
  //       active: true
  //     }
  //   ]
  // },
  {
    label: 'Imprest Holder',
    labelDisable: true,
    children: [
      {
        name: 'Other Deductions',
        to: '/other-deductions',
        exact: true,
        active: true,
      },
      {
        name: 'Other Deductions List',
        to: '/other-deductions-list',
        exact: true,
        active: true,
      },
    ],
  },
  {
    label: 'Tickets',
    labelDisable: true,
    children: [
      {
        name: 'Internal Ticket',
        to: '/internal-tickets-list',
        exact: true,
        active: true,
      },
      {
        name: 'External Ticket',
        to: '/external-list',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket List',
        to: '/leadlistform',
        exact: true,
        active: true,
      },
      {
        name: 'Ticket Creation',
        to: '/leadgeneration',
        active: true,
      },
    ],
  },
  {
    label: 'Document',
    labelDisable: true,
    children: [
      {
        name: 'Add Document',
        to: '/adddocument',
        exact: true,
        active: true,
      },
    ],
  },
];

export const personalRoute = [
  {
    label: 'My Activity',
    labelDisable: true,
    children: [
      {
        name: 'Your Attendance Reports',
        to: '/your-attendance-report',
        exact: true,
        active: true,
      },
    ],
  },
];

export const impressHolderRoutes = [
  {
    name: 'Add Transaction',
    to: '/imprestholder-Transaction',
    exact: true,
    active: true,
  },
  {
    name: 'Transaction List',
    to: '/impress-list',
    exact: true,
    active: true,
  },
];

export const authorizedOfficerRoutes = [
  {
    name: 'Your Manual Attendance Report',
    to: '/your-manual-attendance-report',
    exact: true,
    active: true,
  },
];

export default [
  superAdminRoutes,
  adminRoutes,
  hrRoutes,
  accountManagerRoutes,
  accountAssistantRoutes,
  crmRoutes,
  crmAssistantRoutes,
  gmOpsRoutes,
  fmRoutes,
  storeRoutes,
  viprasMartRoutes,
  personalRoute,
  impressHolderRoutes,
];
