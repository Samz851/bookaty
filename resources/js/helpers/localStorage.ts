// localStorage.ts
export const loadState = (key: string): any => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return ;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return ;
  }
};

export const saveState = (key: string, value: any): void => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch {
    // ignore write errors
  }
};

export const removeState = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore write errors
  }
};

