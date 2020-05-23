const jhipsterEnv = require('generator-jhipster-customizer');

const jhipsterConstants = jhipsterEnv.constants;

module.exports = {
  files: {
    tenant_base: [
      // Copy over aspect
      {
        path: jhipsterConstants.SERVER_MAIN_SRC_DIR,
        templates: [
          {
            file: 'package/aop/_tenant/_UserAspect.java',
            renameTo: generator => `${generator.packageFolder}/aop/${generator.tenantNameLowerFirst}/UserAspect.java`
          }
        ]
      }
    ]
  }
};
