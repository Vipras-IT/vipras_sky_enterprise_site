import { get } from 'lodash';
import { AppConstants } from '../helpers/appConstants';
import { toast } from 'react-toastify';

export const isIterableArray = (array) =>
  Array.isArray(array) && !!array.length;

export const disableFutureDates = (date) => {
  const todayDate = new Date();
  const currentYear = todayDate.getFullYear();
  const currentMonth = todayDate.getMonth();
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  return (
    dateYear < 2023 ||
    dateYear > currentYear ||
    (dateYear === currentYear && dateMonth > currentMonth)
  );
};

//===============================
// Breakpoints
//===============================
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1540,
};

export const getItemFromStore = (key, defaultValue, store = localStorage) => {
  try {
    return store.getItem(key) === null
      ? defaultValue
      : JSON.parse(store.getItem(key));
  } catch {
    return store.getItem(key) || defaultValue;
  }
};

export const setItemToStore = (key, payload, store = localStorage) =>
  store.setItem(key, payload);

export const getStoreSpace = (store = localStorage) =>
  parseFloat(
    (
      escape(encodeURIComponent(JSON.stringify(store))).length /
      (1024 * 1024)
    ).toFixed(2),
  );

//===============================
// Cookie
//===============================
export const getCookieValue = (name) => {
  const value = document.cookie.match(
    '(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)',
  );
  return value ? value.pop() : null;
};

export const createCookie = (name, value, cookieExpireTime) => {
  const date = new Date();
  date.setTime(date.getTime() + cookieExpireTime);
  const expires = '; expires=' + date.toUTCString();
  document.cookie = name + '=' + value + expires + '; path=/';
};

export const numberFormatter = (number, fixed = 2) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(number)) >= 1.0e9
    ? (Math.abs(Number(number)) / 1.0e9).toFixed(fixed) + 'B'
    : // Six Zeroes for Millions
    Math.abs(Number(number)) >= 1.0e6
      ? (Math.abs(Number(number)) / 1.0e6).toFixed(fixed) + 'M'
      : // Three Zeroes for Thousands
      Math.abs(Number(number)) >= 1.0e3
        ? (Math.abs(Number(number)) / 1.0e3).toFixed(fixed) + 'K'
        : Math.abs(Number(number)).toFixed(fixed);
};

//===============================
// Colors
//===============================
export const hexToRgb = (hexValue) => {
  let hex;
  hexValue.indexOf('#') === 0
    ? (hex = hexValue.substring(1))
    : (hex = hexValue);
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b),
  );
  return result
    ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ]
    : null;
};

export const rgbColor = (color = colors[0]) => `rgb(${hexToRgb(color)})`;
export const rgbaColor = (color = colors[0], alpha = 0.5) =>
  `rgba(${hexToRgb(color)},${alpha})`;

export const colors = [
  '#2c7be5',
  '#00d97e',
  '#e63757',
  '#39afd1',
  '#fd7e14',
  '#02a8b5',
  '#727cf5',
  '#6b5eae',
  '#ff679b',
  '#f6c343',
];

export const themeColors = {
  primary: '#2c7be5',
  secondary: '#748194',
  success: '#00d27a',
  info: '#27bcfd',
  warning: '#f5803e',
  danger: '#e63757',
  light: '#f9fafd',
  dark: '#0b1727',
};

export const grays = {
  white: '#fff',
  100: '#f9fafd',
  200: '#edf2f9',
  300: '#a91605',
  400: '#b6c1d2',
  500: '#9da9bb',
  600: '#748194',
  700: '#5e6e82',
  800: '#4d5969',
  900: '#344050',
  1000: '#232e3c',
  1100: '#0b1727',
  black: '#000',
};

export const darkGrays = {
  white: '#fff',
  1100: '#f9fafd',
  1000: '#edf2f9',
  900: '#a91605',
  800: '#b6c1d2',
  700: '#9da9bb',
  600: '#748194',
  500: '#5e6e82',
  400: '#4d5969',
  300: '#344050',
  200: '#232e3c',
  100: '#0b1727',
  black: '#000',
};

export const getGrays = (isDark) => (isDark ? darkGrays : grays);

export const rgbColors = colors.map((color) => rgbColor(color));
export const rgbaColors = colors.map((color) => rgbaColor(color));

export const getColor = (name, dom = document.documentElement) => {
  return getComputedStyle(dom).getPropertyValue(`--falcon-${name}`).trim();
};

//===============================

// Echarts
//===============================
export const getPosition = (pos, params, dom, rect, size) => ({
  top: pos[1] - size.contentSize[1] - 10,
  left: pos[0] - size.contentSize[0] / 2,
});
//===============================
// E-Commerce
//===============================
export const calculateSale = (base, less = 0, fix = 2) =>
  (base - base * (less / 100)).toFixed(fix);
export const getTotalPrice = (cart, baseItems) =>
  cart.reduce((accumulator, currentValue) => {
    const { id, quantity } = currentValue;
    const { price, sale } = baseItems.find((item) => item.id === id);
    return accumulator + calculateSale(price, sale) * quantity;
  }, 0);
export const getSubtotal = (items) =>
  items.reduce((acc, curr) => curr.price * curr.quantity + acc, 0);
export const getDiscountPrice = (total, discount) =>
  total - total * (discount / 100);

export const getProductsQuantity = (products) =>
  products.reduce((acc, product) => product.quantity + acc, 0);

//===============================
// Helpers
//===============================
export const getPaginationArray = (totalSize, sizePerPage) => {
  const noOfPages = Math.ceil(totalSize / sizePerPage);
  const array = [];
  let pageNo = 1;
  while (pageNo <= noOfPages) {
    array.push(pageNo);
    pageNo = pageNo + 1;
  }
  return array;
};

export const capitalize = (str) =>
  (str.charAt(0).toUpperCase() + str.slice(1)).replace(/-/g, ' ');

export const camelize = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

export const dashed = (str) => {
  return str.toLowerCase().replaceAll(' ', '-');
};

//routes helper

export const flatRoutes = (childrens) => {
  const allChilds = [];

  const flatChild = (childrens) => {
    childrens.forEach((child) => {
      if (child.children) {
        flatChild(child.children);
      } else {
        allChilds.push(child);
      }
    });
  };
  flatChild(childrens);

  return allChilds;
};

export const getFlatRoutes = (children) =>
  children.reduce(
    (acc, val) => {
      if (val.children) {
        return {
          ...acc,
          [camelize(val.name)]: flatRoutes(val.children),
        };
      } else {
        return {
          ...acc,
          unTitled: [...acc.unTitled, val],
        };
      }
    },
    { unTitled: [] },
  );

export const routesSlicer = ({ routes, columns = 3, rows }) => {
  const routesCollection = [];
  routes.map((route) => {
    if (route.children) {
      return route.children.map((item) => {
        if (item.children) {
          return routesCollection.push(...item.children);
        }
        return routesCollection.push(item);
      });
    }
    return routesCollection.push(route);
  });

  const totalRoutes = routesCollection.length;
  const calculatedRows = rows || Math.ceil(totalRoutes / columns);
  const routesChunks = [];
  for (let i = 0; i < totalRoutes; i += calculatedRows) {
    routesChunks.push(routesCollection.slice(i, i + calculatedRows));
  }
  return routesChunks;
};

export const getPageName = (pageName) => {
  return window.location.pathname.split('/').slice(-1)[0] === pageName;
};

export const copyToClipBoard = (textFieldRef) => {
  const textField = textFieldRef.current;
  textField.focus();
  textField.select();
  document.execCommand('copy');
};

export const reactBootstrapDocsUrl = 'https://react-bootstrap.github.io';

export const pagination = (currentPage, size) => {
  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let prev = currentPage - 1 - Math.floor(size / 2);

  if (currentPage - 1 - Math.floor(size / 2) < 0) {
    prev = 0;
  }
  if (currentPage - 1 - Math.floor(size / 2) > pages.length - size) {
    prev = pages.length - size;
  }
  const next = prev + size;

  return pages.slice(prev, next);
};

export const addIdField = (items) => {
  return items.map((item, index) => ({
    id: index + 1,
    ...item,
  }));
};

// get file size

export const getSize = (size) => {
  if (size < 1024) {
    return `${size} Byte`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
};

/* Get A Random Number */
export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/* get Dates between */

export const getDates = (
  startDate,
  endDate,
  interval = 1000 * 60 * 60 * 24,
) => {
  const duration = endDate - startDate;
  const steps = duration / interval;
  return Array.from(
    { length: steps + 1 },
    (v, i) => new Date(startDate.valueOf() + interval * i),
  );
};

/* Get Past Dates */
export const getPastDates = (duration) => {
  let days;

  switch (duration) {
    case 'week':
      days = 7;
      break;
    case 'month':
      days = 30;
      break;
    case 'year':
      days = 365;
      break;

    default:
      days = duration;
  }

  const date = new Date();
  const endDate = date;
  const startDate = new Date(new Date().setDate(date.getDate() - (days - 1)));
  return getDates(startDate, endDate);
};

// Add id to items in array
export const addId = (items) =>
  items.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

//

// Get Percentage
export const getPercentage = (number, percent) => {
  return (Number(number) / 100) * Number(percent);
};

//get chunk from array
export const chunk = (arr, chunkSize = 1, cache = []) => {
  const tmp = [...arr];
  if (chunkSize <= 0) return cache;
  while (tmp.length) cache.push(tmp.splice(0, chunkSize));
  return cache;
};

// Slugify text
export const slugifyText = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export const getBillingCycleDays = (month, year) => {
  const startDate = new Date(year, month - 1, 26);
  const endDate = new Date(year, month, 25);
  const days = [];
  const date = new Date(startDate);
  
  while (date <= endDate) {
    const dayValue = new Date(date);
    const alldDys = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayObj = {
      title: `${dayValue.getDate()} ${alldDys[dayValue.getDay()]}`,
      dataIndex: `day${dayValue.getDate()}`,
      editable: true,
      width: 90,
      key: `day${dayValue.getDate()}`,
      day: dayValue.getDate(),
    };
    days.push(dayObj);
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    const dayValue = new Date(date);
    const alldDys = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayObj = {
      title: `${dayValue.getDate()} ${alldDys[dayValue.getDay()]}`,
      dataIndex: `day${dayValue.getDate()}`,
      editable: true,
      width: 90,
      key: `day${dayValue.getDate()}`,
      day: dayValue.getDate(),
    };
    days.push(dayObj);
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const monthValues = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const monthNames = [
  {
    value: 0,
    label: 'January',
  },
  {
    value: 1,
    label: 'February',
  },
  {
    value: 2,
    label: 'March',
  },
  {
    value: 3,
    label: 'April',
  },
  {
    value: 4,
    label: 'May',
  },
  {
    value: 5,
    label: 'June',
  },
  {
    value: 6,
    label: 'July',
  },
  {
    value: 7,
    label: 'August',
  },
  {
    value: 8,
    label: 'September',
  },
  {
    value: 9,
    label: 'October',
  },
  {
    value: 10,
    label: 'November',
  },
  {
    value: 11,
    label: 'December',
  },
];

export const getMonthNames = (year, shouldDisable = true) => {
  const todayDate = new Date();
  const currentMonth = todayDate.getMonth();
  let disablePrevMonth = false;
  if (year === todayDate.getFullYear() && shouldDisable) {
    disablePrevMonth = true;
  }

  const mappedMonth = monthNames.map((item) => {
    let disabled = disablePrevMonth && item.value < currentMonth ? true : false;
    return { ...item, disabled };
  });
  return mappedMonth;
};

export const getMonthNamesNew = (year) => {
  const todayDate = new Date();
  const currentMonth = todayDate.getMonth();
  const months = Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date(year, index, 1);
    const monthName = monthDate.toLocaleString('default', { month: 'long' });
    return {
      label: monthName,
      value: index,
      disabled: index < currentMonth - 12,
    };
  });
  return months;
};

export const getPreviousMonthNames = (year, shouldDisable = true) => {
  const todayDate = new Date();
  const currentMonth = todayDate.getMonth();
  let disablePrevMonth = false;
  if (year === todayDate.getFullYear() && shouldDisable) {
    disablePrevMonth = true;
  }
  const mappedMonth = monthNames.map((item) => {
    let disabled = disablePrevMonth && item.value > currentMonth ? true : false;
    return { ...item, disabled };
  });
  return mappedMonth;
};

export const getShiftOptions = () => {
  return [
    {
      label: 'First Shift (7 am to 2 pm) - A',
      value: 'First Shift (7 am to 2 pm) - A',
    },
    {
      label: 'Second Shift (2 pm to 9 pm) - B',
      value: 'Second Shift (2 pm to 9 pm) - B',
    },
    {
      label: 'Third Shift (9 pm to 7 am) - C',
      value: 'Third Shift (9 pm to 7 am) - C',
    },
    {
      label: 'General Shift (9 am to 6 pm) - G',
      value: 'General Shift (9 am to 6 pm) - G',
    },
    {
      label: 'Day Shift (7 am to 7 PM) - D',
      value: 'Day Shift (7 am to 7 PM) - D',
    },
    {
      label: 'Night Shift ( 7 pm to  7 am) - N',
      value: 'Night Shift ( 7 pm to  7 am) - N',
    },
  ];
};

export const getEmployeeShiftOptions = () => {
  return [
    {
      label: 'Select a shift',
      value: '',
    },
    {
      label: 'First Shift (7 am to 2 pm) - A',
      value: 'A',
    },
    {
      label: 'Second Shift (2 pm to 9 pm) - B',
      value: 'B',
    },
    {
      label: 'Third Shift (9 pm to 7 am) - C',
      value: 'C',
    },
    {
      label: 'General Shift (9 am to 6 pm) - G',
      value: 'G',
    },
    {
      label: 'Day Shift (7 am to 7 PM) - D',
      value: 'D',
    },
    {
      label: 'Night Shift ( 7 pm to  7 am) - N',
      value: 'N',
    },
    // {
    //   label: 'Week off - W',
    //   value: 'W'
    // },
    {
      label: 'National Holiday - NH',
      value: 'NH',
    },
    {
      label: 'National Holiday Working - NHW',
      value: 'NHW',
    },
  ];
};

export const getShiftMapping = () => {
  return {
    A: 'First Shift (7 am to 2 pm) - A',
    B: 'Second Shift (2 pm to 9 pm) - B',
    C: 'Third Shift (9 pm to 7 am) - C',
    G: 'General Shift (9 am to 6 pm) - G',
    D: 'Day Shift (7 am to 7 PM) - D',
    N: 'Night Shift ( 7 pm to  7 am) - N',
    W: 'Week off',
  };
};
export const normalizeMonth = (month) => {
  const monthMap = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };
  return monthMap[month.toLowerCase()] || null;
};

export const Role = [
  'FM - Facility Manager',
  'FE - Facility Engineer',
  'Property Manager',
  'Facility Executive',
  'HD - Helpdesk',
  'Site Accountant',
  'Technical Manager',
  'Technical Supervisor',
  'HK Supervisor',
  'Garden Supervisor',
  'Multi Skill Technician',
  'Electrician',
  'Plumber',
  'STP Operator',
  'WTP Operator',
  'Swimming Pool Operator',
  'GYM Trainer',
  'Lift Operator',
  'HK - Male',
  'HK - Female',
  'Pantry Employee',
  'Gardener Male',
  'Gardener Female',
  'Pest Controller',
  'Store Keeper',
  'Safety Officer',
  'SO - Security Officer',
  'ASO - Assistant Security Officer',
  'Head Guard',
  'Lift Guard',
  'Fire Guard',
  'Security Guard - Male',
  'Security Guard - Female',
  'Manpower Supervisor',
  'Skilled Male',
  'Unskilled Male',
  'Skilled Female',
  'Unskilled Female',
  'OJT 1',
  'OJT 2',
  'Others',
];

export const updateAttendanceRole = [
  'FACILITY MANAGER',
  'HELPDESK',
  'SECURITY OFFICER',
  'ASSISTANT SECURITY OFFICER',
  'SECURITY GUARD',
  'HEAD GUARD',
  'DEEP CLEANING MANPOWER',
  'HOUSE KEEPING ',
  'SUPERVISOR',
  'LADY GUARD',
  'GARDENER',
  'MULTI SKILL TECHNICIAN',
  'TECHNICIAN',
  'FIELD OFFICER',
  'PANTRY EMPLOYEE',
  'CL',
];

export const registrationRole = [
  'VICE PRESIDENT',
  'MANAGING DIRECTOR',
  'DIRECTOR',
  'GENERAL MANAGER',
  'ASSISTANT VICE PRESIDENT',
  'ADMIN',
  'ADMIN MANAGER',
  'ADMIN ASSISTANT',
  'ACCOUNTS ASSISTANT',
  'ACCOUNTS MANAGER',
  'SECURITY OFFICER',
  'ASSISTANT SECURITY OFFICER',
  'BRANCH MANAGER',
  'BUSINESS DEVELOPMENT MANAGER',
  'CL',
  'CRM MANAGER',
  'CRM EXECUTIVE',
  'CRM ASSISTANT',
  'DEEP CLEANING MANPOWER',
  'DRIVER',
  'ELECTRICIAN',
  'FACILITY ENGINEER',
  'FACILITY EXECUTIVE',
  'FACILITY MANAGER',
  'FIELD OFFICER',
  'GARDENER',
  'GENERAL MANAGER - TECHNICAL',
  'GENERAL MANAGER - SOFT SERVICE',
  'GENERAL MANAGER - WASTE MANAGEMENT',
  'GENERAL MANAGER - LAUNDRY ',
  'GENERAL MANAGER - SECURITY',
  'GENERAL MANAGER - FACILITY',
  'GYM TRAINER',
  'HOUSE KEEPING',
  'HOUSE KEEPING - MALE',
  'HOUSE KEEPING - FEMALE',
  'HELPDESK',
  'SUPERVISOR - HOUSE KEEPING',
  'HR ASSISTANT',
  'HR MANAGER',
  'INFORMATION TECHNOLOGY',
  'LADY GUARD',
  'TECHNICAL MANAGER',
  'MULTI SKILL TECHNICIAN',
  'TECHNICIAN',
  'OPERATION MANAGER',
  'OPERATION MANAGER - TECHNICAL',
  'OPERATION MANAGER - WATER TREATMENT',
  'PEST CONTROLLER',
  'SHOP INCHARGE',
  'PLUMBER',
  'SECURITY GUARD',
  'SENIOR OPERATION MANAGER',
  'SKILLED LABOUR',
  'UNSKILLED LABOUR',
  'STP OPERATOR',
  'WTP OPERATOR',
  'STP / WTP OPERATOR',
  'SUPERVISOR - TECHNICAL',
  'SUPERVISOR - MST',
  'SUPERVISOR - GARDENER',
  'SWIMMING POOL OPERATOR',
  'STORE KEEPER',
  'PROPERTY MANAGER',
  'SITE ACCOUNTANT',
  'LIFT OPERATOR',
  'PANTRY EMPLOYEE',
  'SAFETY OFFICER',
  'HEAD GUARD',
  'LIFT GUARD',
  'FIRE GUARD',
  'SUPERVISOR - MANPOWER',
  'TRAINING MANAGER',
  'OJT 1',
  'OJT 2',
  'OTHERS',
];

export const loginRole = [
  'SUPER_ADMIN',
  'ADMIN',
  'FM',
  'STORE_INCHARGE',
  'ACCOUNTS_MANAGER',
  'ACCOUNTS_ASSISTANT',
  'HR',
  'VIPRAS_MART',
  'BDM',
  'CRM',
  'CRM_ASSISTANT',
  'GM',
  'OPS',
  'EMPLOYEE'
];

export const transectionType = [
  { value: 'ADVANCES', label: 'ADVANCES' },
  { value: 'EXPENSES', label: 'EXPENSES' },
  { value: 'IMPREST_TO', label: 'IMPREST_TO' },
  { value: 'VENDOR_PAYMENT', label: 'VENDOR_PAYMENT' },
  { value: 'SALARY_PAID', label: 'SALARY_PAID' },
  { value: 'HANDLOAN_REPAYMENT', label: 'HANDLOAN_REPAYMENT' },
];

export const accountsTransactionTypes = [
  { value: 'ADVANCES', label: 'ADVANCES' },
  { value: 'EXPENSES', label: 'EXPENSES' },
  { value: 'IMPREST_TO', label: 'IMPREST_TO' },
  { value: 'HANDLOAN_REPAYMENT', label: 'HANDLOAN_REPAYMENT' },
  { value: 'VENDOR_PAYMENT', label: 'VENDOR_PAYMENT' },
  { value: 'DIRECT_EXPENSES', label: 'DIRECT_EXPENSES' },
  { value: 'SALARY_PAID', label: 'SALARY_PAID' },
  { value: 'GST', label: 'GST' },
  { value: 'ESI', label: 'ESI' },
  { value: 'PF', label: 'PF' },
  { value: 'LOAN_EMI', label: 'LOAN_EMI' },
  { value: 'INVESTMENT', label: 'INVESTMENT' },
  { value: 'OD_RETURN', label: 'OD_RETURN' },
  { value: 'DDS', label: 'DDS' },
  { value: 'SALARY_RETURN', label: 'SALARY_RETURN' },
  { value: 'IT_RETURN', label: 'IT_RETURN' },
  { value: 'BANK_RETURN', label: 'BANK_RETURN' },
  { value: 'CLIENT_RECEIPTS', label: 'CLIENT_RECEIPTS' },
  { value: 'HANDLOAN_RECEIPTS', label: 'HANDLOAN_RECEIPTS' },
  { value: 'OD_RECEIPT', label: 'OD_RECEIPT' },
  { value: 'BANK_CLOSING_BALANCE', label: 'BANK_CLOSING_BALANCE' },
];

export function sortSiteIds(siteIds) {
  return [...siteIds].sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  });
}

export const getOptionsData = (datas) => {
  const authDatas = datas?.map((item) => ({
    value: item.employeeId,
    label: item.employeeName,
  }));
  return authDatas || [];
};

export const formatDateToIST = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3,'); // Swap DD/MM/YYYY to MM/DD/YYYY
};


export const formattedAmount = (amount) => {
  if (amount == null || isNaN(amount)) {
    return '-'; // Return a default value or placeholder for invalid numbers
  }
  return amount.toLocaleString('en-IN', {
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const getErrorMessage = (response) => {
  let errorMessage = get(response, 'data.message', '');
  if (errorMessage === 'jwt expired') {
    errorMessage = 'Your session has expired; please logout and re-login!';
  }

  if (get(response, 'data.success')) {
    errorMessage = false;
  }

  return errorMessage;
};

export const calculateGrandTotalAmount = (
  results = [],
  prop = 'totalAmount',
) => {
  if (!Array.isArray(results)) {
    console.error('Invalid input: "results" must be an array.');
    return 0;
  }
  return results.reduce((accumulator, item) => {
    const value = parseFloat(item?.[prop]) || 0;
    if (isNaN(value)) {
      console.warn(`Invalid value for property "${prop}" in item:`, item);
    }
    return accumulator + value;
  }, 0);
};

// Get current and previous months dynamically
export const getCurrandPrevMonth = () => {
  const today = new Date();
  const currentMonthIndex = today.getMonth(); // 0 = Jan
  const previousMonthIndex = (currentMonthIndex - 1 + 12) % 12;

  const monthOptions = [
    {
      label: monthValues[previousMonthIndex],
      value: previousMonthIndex,
      key: previousMonthIndex + 1,
    },
    {
      label: monthValues[currentMonthIndex],
      value: currentMonthIndex,
      key: currentMonthIndex + 1,
    },
  ];
  return monthOptions;
}

export const checkEmptyfield = (variables) => {
  const isEmpty = (val) => val == null || val === '';
  const emptyVars = Object.keys(variables).filter(
    (key) => isEmpty(variables[key])
  );
  return emptyVars.length ? emptyVars : [];
};

export const showEmptyVarsToast = (emptyVars) => {
  let errroMsgField = emptyVars.map(data => {
    return AppConstants.addTransactionError[data]
  })

  if (emptyVars.length > 0) {
    toast.error(`Please enter ${errroMsgField.join(', ')} value(s)`, {
      theme: 'colored',
    });
  }

};

