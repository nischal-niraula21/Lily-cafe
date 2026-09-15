const REQUIRED_RUNTIME_ENV = ['MONGODB_URI', 'JWT_SECRET'];

export function validateRuntimeEnv() {
  const missing = REQUIRED_RUNTIME_ENV.filter(
    (key) => !String(process.env[key] || '').trim()
  );

  if (missing.length) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}`
    );
  }
}
