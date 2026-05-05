function loadComponent(id, file) {
    return fetch(file)
        .then(function (res) {
            if (!res.ok) {
                throw new Error("Component not found: " + file);
            }
            return res.text();
        })
        .then(function (data) {
            const container = document.getElementById(id);

            if (!container) {
                throw new Error("Container not found: " + id);
            }

            container.innerHTML = data;
        });
}