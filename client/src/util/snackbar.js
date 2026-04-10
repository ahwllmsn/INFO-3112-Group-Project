// Snackbar
// https://www.w3schools.com/howto/howto_js_snackbar.asp
const snackBar = document.getElementById("snackbar");

const showSnackBar = () => {
  snackBar.className = "show";
  setTimeout(() => {
    snackBar.className = snackBar.className.replace("show", "");
  }, 2500)
}

export {
    snackBar,
    showSnackBar
}