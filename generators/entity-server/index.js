/* eslint-disable consistent-return */
const debug = require('debug')('tenantview:entity:server');
const path = require('path');
const jhipsterEnv = require('generator-jhipster-customizer');

const TenantisedNeedle = require('./needle-api/needle-server-tenantised-entities-services');

const setupTenantVariables = require('../multitenancy-utils').setupTenantVariables;

const jhipsterConstants = jhipsterEnv.constants;

module.exports = class extends jhipsterEnv.generator('entity-server', {
    bugfixerPaths: path.resolve(__dirname, '../../bugfixer'),
    applyPatcher: true,
    patcherPath: path.resolve(__dirname, 'patcher')
}) {
    constructor(args, opts) {
        debug(`Initializing entity-server ${opts.context.name}`);
        super(args, opts);
        // Fix {Tenant}Resource.java setting ENTITY_NAME as 'admin{Tenant}'
        this.skipUiGrouping = true;
    }

    get writing() {
        return {
            ...super._writing(),

            // sets up all the variables we'll need for the templating
            setUpVariables() {
                this.SERVER_MAIN_SRC_DIR = jhipsterConstants.SERVER_MAIN_SRC_DIR;
            },
            /* tenant variables */
            setupTenantVariables,

            // make the necessary server code changes
            customServerCode() {
                const tenantisedNeedle = new TenantisedNeedle(this);
                if (this.tenantAware) {
                    tenantisedNeedle.addEntityToTenantAspect(this, this.name);
                } else if (this.isTenant) {
                    this.addConstraintsChangelogToLiquibase(`${this.changelogDate}-1__user_${this.tenantNameUpperFirst}_constraints`);
                    this.addConstraintsChangelogToLiquibase(`${this.changelogDate}-2__${this.tenantNameLowerCase}_user_data`);

                    debug('Adding already tenantised entities');
                    if (this.configOptions.tenantAwareEntities) {
                        this.queueMethod(
                            function() {
                                // Run after patcher
                                this.configOptions.tenantAwareEntities.forEach(tenantAwareEntity => {
                                    debug(`Adding entity ${tenantAwareEntity}`);
                                    tenantisedNeedle.addEntityToTenantAspect(this, tenantAwareEntity);
                                });
                            },
                            'tenantisedNeedle',
                            'writing'
                        );
                    }
                }
            }
        };
    }
};
