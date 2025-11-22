// Generate unique numbers for receipts, deliveries, transfers, adjustments
const generateNumber = async (prefix, Model, numberField) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const dateStr = `${year}${month}`;

  // Find the latest document with this prefix and date
  const latest = await Model.findOne({
    [numberField]: new RegExp(`^${prefix}${dateStr}`)
  }).sort({ [numberField]: -1 });

  let sequence = 1;
  if (latest && latest[numberField]) {
    const lastSeq = parseInt(latest[numberField].slice(-4));
    sequence = lastSeq + 1;
  }

  const sequenceStr = String(sequence).padStart(4, '0');
  return `${prefix}${dateStr}${sequenceStr}`;
};

module.exports = generateNumber;

