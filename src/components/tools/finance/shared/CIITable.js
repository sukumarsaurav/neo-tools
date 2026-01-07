// Cost Inflation Index (CII) Table
// Source: Income Tax Department of India
// Used for indexation of capital gains

export const CII_TABLE = {
    '2001-02': 100,
    '2002-03': 105,
    '2003-04': 109,
    '2004-05': 113,
    '2005-06': 117,
    '2006-07': 122,
    '2007-08': 129,
    '2008-09': 137,
    '2009-10': 148,
    '2010-11': 167,
    '2011-12': 184,
    '2012-13': 200,
    '2013-14': 220,
    '2014-15': 240,
    '2015-16': 254,
    '2016-17': 264,
    '2017-18': 272,
    '2018-19': 280,
    '2019-20': 289,
    '2020-21': 301,
    '2021-22': 317,
    '2022-23': 331,
    '2023-24': 348,
    '2024-25': 363,
    '2025-26': 378, // Estimated - Update when official CII is released
};

// Helper to get fiscal year from a date
export const getFiscalYear = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-indexed

    // Fiscal year starts from April
    if (month >= 3) { // April (3) to December (11)
        return `${year}-${String(year + 1).slice(2)}`;
    } else { // January (0) to March (2)
        return `${year - 1}-${String(year).slice(2)}`;
    }
};

// Get CII for a given fiscal year
export const getCII = (fiscalYear) => {
    return CII_TABLE[fiscalYear] || null;
};

// Calculate indexed cost
export const calculateIndexedCost = (purchaseCost, purchaseFY, saleFY) => {
    const purchaseCII = getCII(purchaseFY);
    const saleCII = getCII(saleFY);

    if (!purchaseCII || !saleCII) {
        return null;
    }

    return (purchaseCost * saleCII) / purchaseCII;
};

// Get list of available fiscal years
export const getAvailableFiscalYears = () => {
    return Object.keys(CII_TABLE).sort();
};

export default CII_TABLE;
