export const RENDER_STEPER_STATUS = (step) => {
  switch (step) {
    case "1":
      return {
        status_2: "current",
        label_2: "2",
        status_3: "default",
        label_3: "3",
      };
    case "2":
      return {
        status_2: "default",
        label_2: "2",
        status_3: "default",
        label_3: "3",
      };
    default:
      break;
  }
};
