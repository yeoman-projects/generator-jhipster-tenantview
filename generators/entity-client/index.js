const debug = require('debug')('tenantview:entity:client');

const jhipsterEnv = require('../../lib/jhipster-environment');

const EntityClientGenerator = jhipsterEnv.generator('entity-client');

module.exports = class extends EntityClientGenerator {
    constructor(args, opts) {
        debug(`Initializing entity-client ${opts.context.name}`);
        super(args, opts);
    }

    get writing() {
        return { ...super._writing(), applyPatcher: this.applyPatcher };
    }
};
