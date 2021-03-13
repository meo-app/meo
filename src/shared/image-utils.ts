function base64ToImageUrl(base64: string) {
  return `data:image/jpeg;base64,${base64}`;
}

export { base64ToImageUrl };
