interface EnvObject {
  [develop: string]: {
    httpPort: number;
    httpsPort: number;
    envName: string;
  };
}

const environments: EnvObject = {
  develop: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'develop',
  },
  production: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
  },
};

const currentEnvironment: string | undefined = process.env.NODE_ENV;
let environmentToExport;
if (currentEnvironment !== undefined) {
  environmentToExport = environments[currentEnvironment];
} else {
  environmentToExport = environments.develop;
}

const env = environmentToExport;

export default env;
