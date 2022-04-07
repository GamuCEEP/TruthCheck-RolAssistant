const templater = {
  fromFills: (template, fill) => {
    let result = template;
    for (const val in fill) {
      result = result.replaceAll(`{${val}}`, fill[val]);
    }
    return result;
  },
  fromTemplate: (template, fill) => {
    let resutl = template;
    for (const match of template.match(/{.*?}/g) || []) {
      resutl = resutl.replaceAll(
        match,
        fill[match.substring(1, match.length - 1)] ?? match,
      );
    }
    return resutl;
  },
};



export { templater };
