export default value => {
  return value.replace(/@.*\.com$/, "") || value;
};
