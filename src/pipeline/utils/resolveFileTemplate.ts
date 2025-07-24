/**
 * Helper for resolving the templated file names for IPEDS bulk data file.
 */
export const resolveFileTemplate = ({
  template,
  year,
}: {
  template: string;
  year: number;
}) => {
  const tokens = [
    {
      name: 'YEAR',
      value: `${year}`,
    },
    {
      name: 'ACADEMIC_YEAR',
      value: `${(year - 1).toString().slice(2)}${(year).toString().slice(2)}`,
    },
  ];
  return tokens.reduce((s, token) => {
    return {
      fileType: s.fileType.replace(`{${token.name}}`, token.value),
      fileId: s.fileType.replace(`{${token.name}}`, ""),
    };
  }, {
    fileType: template,
    fileId: template,
  });
};
