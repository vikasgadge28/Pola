
function updateAvatar(attribute, currentSelections) {
    const avatarImage = document.querySelector(`.${attribute}-image`);
    if (avatarImage) {
        let src = `assets/pfp_generator/images/${attribute}/${currentSelections[attribute]}.png`;
        avatarImage.src = src;
    } else {
        console.error(`Element with class ${attribute}-image not found`);
    }
}

function changeAttribute(attribute, direction, attributes, currentSelections) {
    const currentArray = attributes[attribute];
    const currentIndex = currentArray.indexOf(currentSelections[attribute]);
    let newIndex = direction === "left"
        ? (currentIndex - 1 + currentArray.length) % currentArray.length
        : (currentIndex + 1) % currentArray.length;
    currentSelections[attribute] = currentArray[newIndex];
    updateAvatar(attribute, currentSelections);
}

function downloadAvatar() {
    const canvas = document.getElementById("avatar-canvas");
    const ctx = canvas.getContext("2d");
    const fixedWidth = 500; // Fixed width for the downloaded image
    const fixedHeight = 500; // Fixed height for the downloaded image
    canvas.width = fixedWidth;
    canvas.height = fixedHeight;

    const imageSources = [
        document.querySelector(".background-image").src,
        document.querySelector(".clothes-image").src,
        document.querySelector(".head-image").src,
        document.querySelector(".eyes-image").src,
        document.querySelector(".glasses-image").src,
        document.querySelector(".hats-image").src,
        document.querySelector(".mouth-image").src,
        document.querySelector(".pola-army-image").src
    ];

    const drawPromises = imageSources.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                ctx.drawImage(img, 0, 0, fixedWidth, fixedHeight);
                resolve();
            };
            img.onerror = reject;
        });
    });

    Promise.all(drawPromises).then(() => {
        const downloadLink = document.createElement("a");
        downloadLink.download = "avatar.png";
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.click();
    }).catch(err => {
        console.error("Error drawing images:", err);
    });
}

// Fetch the JSON data
fetch("assets/data/attributes.json")
    .then(response => response.json())
    .then(data => {
        const attributes = data.attributes;
        const attributeDefaults = data.attributeDefaults;
        const currentSelections = { ...attributeDefaults };

        Object.keys(attributeDefaults).forEach(key => {
            currentSelections[key] = attributeDefaults[key];
            updateAvatar(key, currentSelections);
        });

        document.querySelectorAll(".control").forEach(control => {
            const attributeName = control.querySelector("span").textContent.toLowerCase();
            control.querySelector(".left-arrow").addEventListener("click", () => changeAttribute(attributeName, "left", attributes, currentSelections));
            control.querySelector(".right-arrow").addEventListener("click", () => changeAttribute(attributeName, "right", attributes, currentSelections));
        });

        document.querySelector(".download-button").addEventListener("click", downloadAvatar);

        document.querySelector(".random-button").addEventListener("click", () => {
            Object.keys(attributes).forEach(key => {
                currentSelections[key] = attributes[key][Math.floor(Math.random() * attributes[key].length)];
                updateAvatar(key, currentSelections);
            });
        });
    })
    .catch(error => {
        console.error("Error loading JSON data:", error);
    });
