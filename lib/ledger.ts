export type CreditLedgerParams = {
  userId: string;
  delta: number;
  reason: string;
  ref?: string | null;
};

// Create a credit ledger entry across possible table names.
// Prefers CreditLedger (delta), falls back to Ledger (amount) if present.
export async function createCreditLedger(tx: any, params: CreditLedgerParams) {
  const { userId, delta, reason, ref = null } = params;
  // Try canonical schema first
  try {
    if (tx?.creditLedger?.create) {
      return await tx.creditLedger.create({
        data: { userId, delta, reason, ref },
      });
    }
  } catch (e) {
    // fall through to other shapes
  }
  // Fallback: alternate names some branches used
  try {
    if (tx?.ledger?.create) {
      return await tx.ledger.create({
        data: { userId, amount: delta, reason, ref },
      });
    }
  } catch (e) {
    // fall through
  }
  try {
    if (tx?.ledgerEntries?.create) {
      return await tx.ledgerEntries.create({
        data: { userId, delta, reason, ref },
      });
    }
  } catch (e) {
    // fall through
  }
  throw new Error('No ledger table available for credit entry');
}
