const userState = new Map();

export function setState(id, data) {
  userState.set(id, {
    ...(userState.get(id) || { step: 0, score: 0 }),
    ...data,
  });
}

export function getState(id) {
  return userState.get(id) || null;
}

export function clearState(id) {
  userState.delete(id);
}
