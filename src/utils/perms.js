export const PERMS = {
  officer:   ['dashboard','pathway','challenges','startups','evaluations','pilots','contracts','monitoring','payments','validation','evidence','analytics','publicvalue','audit'],
  evaluator: ['dashboard','evaluations','challenges','evidence'],
  validator: ['dashboard','validation','evidence','pilots','monitoring'],
  accounts:  ['dashboard','contracts','payments','evidence','pilots'],
  startup:   ['dashboard','challenges','pilots','payments','evidence'],
  public:    ['dashboard','pathway','challenges','analytics','publicvalue']
};

export const can = (role, key) => (PERMS[role] || []).includes(key);