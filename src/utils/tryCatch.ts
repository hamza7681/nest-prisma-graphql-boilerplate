export const tryCatch = <T>({ fn }: { fn: () => T }) => {
  try {
    const response = fn();
    return { success: true, response, error: null };
  } catch (error: unknown) {
    return { success: false, response: null, error };
  }
};

export const asyncTryCatch = async <T>({ fn }: { fn: () => Promise<T> }) => {
  try {
    const response = await fn();
    return { success: true, response, error: null };
  } catch (error: unknown) {
    const normalizedError =
      error instanceof Error ? error : new Error(String(error));
    return { success: false, response: null, error: normalizedError };
  }
};
