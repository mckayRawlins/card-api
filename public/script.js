fetch("/delete/128", {
  method: "DELETE",
})
  .then((response) => response.text())
  .then((data) => {
    console.log(data); // should say "Deleted item with ID 2"
  })
  .catch((error) => {
    console.error("Error:", error);
  });
