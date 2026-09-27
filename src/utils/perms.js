export const PERMS = {
  gov:       ['dashboard','pathway','challenges','startups','evaluations','pilots','contracts','monitoring','payments','validation','evidence','analytics','publicvalue','audit'],
  evaluator: ['dashboard','evaluations','challenges','evidence'],
  startup:   ['dashboard','challenges','pilots','payments','evidence'],
  validator: ['dashboard','validation','evidence','pilots','monitoring'],
  accounts:  ['dashboard','contracts','payments','evidence','pilots'],
  admin:     ['dashboard','pathway','challenges','startups','evaluations','pilots','contracts','monitoring','payments','validation','evidence','analytics','publicvalue','templates','audit','settings']
};

export const can = (role, key) => (PERMS[role] || []).includes(key);