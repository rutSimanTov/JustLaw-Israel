
function isLetter(text: string): boolean {
  return /^[\p{L}\s.,:;!?'"“”‘’\-()]+$/u.test(text);
}


function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(0)?[0-9]{7,15}$/;
  return phoneRegex.test(phone);
}

function isValidURL(url: string): boolean {
  const urlRegex =
    /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,6}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
  return urlRegex.test(url);
}

function validateProfileData(body: any) {
  const errors = [];

  // 🧩 Step 1 - full_name
  if (!body.full_name) {
    errors.push({
      field: "full_name",
      message: "Full name is required.",
    });
  } else {
    const name = body.full_name.trim();

    if (name.length < 2) {
      errors.push({
        field: "full_name",
        message: "Full name must be at least 2 characters.",
      });
    } else if (name.length > 100) {
      errors.push({
        field: "full_name",
        message: "Full name must be at most 100 characters.",
      });
    } else if (!isLetter(name)) {
      errors.push({
        field: "full_name",
        message:
          "Full name can contain only letters (any language), spaces, dots, apostrophes or hyphens.",
      });
    }
  }

  // project_link - אם קיים
  if (body.project_link) {
    const trimmedLink = body.project_link.trim();
    if (!isValidURL(trimmedLink)) {
      errors.push({
        field: "project_link",
        message: "Project link must be a valid URL.",
      });
    }
  }

  // image - חייב להיות מחרוזת URL או אובייקט File
  if (
    body.image &&
    typeof body.image !== "string" &&
    !(body.image instanceof File)
  ) {
    errors.push({
      field: "image",
      message: "Image must be a URL string or file object.",
    });
  }

  // 🧩 Step 2 - role_description
  const roleDesc = body.role_description?.trim() || "";
  if (!roleDesc) {
    errors.push({
      field: "role_description",
      message: "Role description is required.",
    });
  } else if (roleDesc.length < 5) {
    errors.push({
      field: "role_description",
      message: "Role description must be at least 5 characters.",
    });
  } else if (!isLetter(roleDesc)) {
    errors.push({
      field: "role_description",
      message:
        "Role description can contain only letters, spaces, dots, apostrophes or hyphens.",
    });
  }

  // country_region
  const country = body.country_region?.trim() || "";
  if (!country) {
    errors.push({
      field: "country_region",
      message: "Country/Region is required.",
    });
  } else if (country.length < 2) {
    errors.push({
      field: "country_region",
      message: "Country/Region must be at least 2 characters.",
    });
  } else if (!isLetter(country)) {
    errors.push({
      field: "country_region",
      message:
        "Country/Region must contain only letters, spaces, dots, apostrophes or hyphens.",
    });
  }



const value_sentence = body.value_sentence?.trim() || "";

if (!value_sentence) {
  errors.push({
    field: "value_sentence",
    message: "Value sentence is required.",
  });
} else if (value_sentence.length < 10) {
  errors.push({
    field: "value_sentence",
    message: "Value sentence must be at least 10 characters.",
  });
} else if (!isLetter(value_sentence)) {
  errors.push({
    field: "value_sentence",
    message:
      "Value sentence can contain only letters, digits, spaces, dots, apostrophes, hyphens and common punctuation.",
  });
}

 

  // keywords - מערך של 1 עד 3 מחרוזות, כל מחרוזת לפחות 2 תווים
  if (!Array.isArray(body.keywords) || body.keywords.length === 0) {
    errors.push({
      field: "keywords",
      message: "At least one keyword is required.",
    });
  } else if (body.keywords.length > 3) {
    errors.push({
      field: "keywords",
      message: "No more than 3 keywords are allowed.",
    });
  } else if (
    !body.keywords.every(
      (k: string) => typeof k === "string" && /^[\p{L}\d\s\-]{2,}$/u.test(k)
    )
  ) {
    errors.push({
      field: "keywords",
      message:
        "Each keyword must be at least 2 characters and contain only letters, digits or hyphens.",
    });
  }

  // current_challenge
  const currentChallenge = body.current_challenge?.trim() || "";
  if (!currentChallenge) {
    errors.push({
      field: "current_challenge",
      message: "Current challenge is required.",
    });
  } else if (currentChallenge.length < 10) {
    errors.push({
      field: "current_challenge",
      message: "Current challenge must be at least 10 characters.",
    });
  } else if (!isLetter(currentChallenge)) {
    errors.push({
      field: "current_challenge",
      message:
        "Current challenge can contain only letters, spaces, dots, apostrophes or hyphens.",
    });
  }

  // 🧩 Step 3 - connection_types - מערך לא ריק, מחרוזות עם לפחות 2 תווים
  if (
    !Array.isArray(body.connection_types) ||
    body.connection_types.length === 0
  ) {
    errors.push({
      field: "connection_types",
      message: "Connection types must be a non-empty array.",
    });
  } else if (
    !body.connection_types.every(
      (c: string) => typeof c === "string" && c.trim().length >= 2
    )
  ) {
    errors.push({
      field: "connection_types",
      message:
        "Connection types must be strings with at least 2 meaningful characters.",
    });
  }

  // engagement_types - בדיקה דומה
  if (!Array.isArray(body.engagement_types) || body.engagement_types.length === 0) {
    errors.push({
      field: "engagement_types",
      message: "Engagement types must be a non-empty array.",
    });
  } else if (
    !body.engagement_types.every(
      (e: string) => typeof e === "string" && e.trim().length >= 2
    )
  ) {
    errors.push({
      field: "engagement_types",
      message:
        "Engagement types must be strings with at least 2 meaningful characters.",
    });
  }

  // contactInfo.phone - אם קיים ובלא ריק
  if (
    body.contactInfo &&
    body.contactInfo.phone !== undefined &&
    body.contactInfo.phone !== ""
  ) {
    if (!isValidPhone(body.contactInfo.phone)) {
      errors.push({
        field: "contactInfo.phone",
        message:
          "Phone must contain only digits and optionally start with '0', length 7–15 digits.",
      });
    }
  }

  // contactInfo.linkedInUrl - חייב להתחיל ב- https://www.linkedin.com/ ולהיות URL תקין
  if (body.contactInfo?.linkedInUrl) {
    if (!body.contactInfo.linkedInUrl.startsWith("https://www.linkedin.com/")) {
      errors.push({
        field: "contactInfo.linkedInUrl",
        message: "LinkedIn URL must begin with 'https://www.linkedin.com/'.",
      });
    } else if (!isValidURL(body.contactInfo.linkedInUrl)) {
      errors.push({
        field: "contactInfo.linkedInUrl",
        message: "LinkedIn URL is not valid.",
      });
    }
  }

  // contactInfo.websiteUrl
  if (body.contactInfo?.websiteUrl) {
    if (!isValidURL(body.contactInfo.websiteUrl)) {
      errors.push({
        field: "contactInfo.websiteUrl",
        message: "Website URL is not valid.",
      });
    }
  }

  // is_visible חייב להיות בוליאני
  if (typeof body.is_visible !== "boolean") {
    errors.push({
      field: "is_visible",
      message: "Visibility must be true or false.",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default validateProfileData;
