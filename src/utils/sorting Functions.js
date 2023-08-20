export function stableSort(array, comparator, dateSort) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

function descendingComparator(a, b, orderBy, dateSort, numericSort) {
  let firstValue;
  let secondValue;

  if (dateSort) {
    firstValue = a[orderBy].seconds;
    secondValue = b[orderBy].seconds;
  } else if (numericSort) {
    firstValue = Number(a[orderBy]);
    secondValue = Number(b[orderBy]);
  } else {
    firstValue = a[orderBy].toLowerCase();
    secondValue = b[orderBy].toLowerCase();
  }

  if (secondValue < firstValue) {
    return -1;
  }
  if (secondValue > firstValue) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy, dateSort, numericSort) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy, dateSort, numericSort)
    : (a, b) => -descendingComparator(a, b, orderBy, dateSort, numericSort);
}
export const convertObjToArray = (obj) => {
  let array = [];
  array =
    obj &&
    Object.keys(obj).map((item) => {
      return {
        ...obj[item],
      };
    });

  return array;
};
