import { measurementUnitMapValues } from "./MeasurementUnitMapValues";

export const GetPropertyDetails = (property) => {
  const propertyDetails = {};

  //Base properties
  propertyDetails.propertyType = {
    label: "Property Type",
    value: property.propertyType,
  };
  propertyDetails.propertyCategory = {
    label: "Property Category",
    value: property.propertyCategory,
  };
  propertyDetails.listingType = {
    label: "Listing Type",
    value: property.listingType,
  };
  propertyDetails.locationLat = {
    label: "Location Lat",
    value: property.locationLat,
  };
  propertyDetails.locationLon = {
    label: "Location Lon",
    value: property.locationLon,
  };
  propertyDetails.city = {
    label: "City",
    value: property.city,
  };
  propertyDetails.state = {
    label: "State",
    value: property.state,
  };
  propertyDetails.description = {
    label: "Description",
    value: property.description,
  };
  propertyDetails.priceNegotiable = {
    label: "Price Negotiable",
    value: property.priceNegotiable === true ? "Yes" : "No",
  };
  propertyDetails.price = {
    label: "Price",
    value: `${property.price} ${property.currency} ${
      property.pricePerUnit ? ` / ${measurementUnitMapValues[property.pricePerUnit]}` : ""
    }`,
  };
  propertyDetails.pricePerUnit = {
    label: "Price Per Unit",
    value: property.pricePerUnit,
  };
  propertyDetails.rent = {
    label: "Rent",
    value: `${property.rent} ${property.currency}`,
  };
  propertyDetails.rentDuration = {
    label: "Rent Duration",
    value: property.rentDuration,
  };
  propertyDetails.deposit = {
    label: "Deposit",
    value: `${property.deposit} ${property.currency}`,
  };
  propertyDetails.postedOn = {
    label: "Posted On",
    value: property.postedOn,
  };
  propertyDetails.propertyStatus = {
    label: "Property Status",
    value: property.propertyStatus,
  };

  if (property.propertyType == "Residential") {
    if (property.propertyCategory == "House") {
      propertyDetails.length = {
        label: "Length",
        value: `${property.houseDetails.length} ${
          measurementUnitMapValues[property.houseDetails.measurementUnit]
        }`,
      };
      propertyDetails.width = {
        label: "Width",
        value: `${property.houseDetails.width} ${
          measurementUnitMapValues[property.houseDetails.measurementUnit]
        }`,
      };
      if (propertyDetails.height) {
        propertyDetails.height = {
          label: "Height",
          value: `${property.houseDetails.height} ${
            measurementUnitMapValues[property.houseDetails.measurementUnit]
          }`,
        };
      } else {
        propertyDetails.height = {
          label: "Height",
          value: "-",
        };
      }
      propertyDetails.floorCount = {
        label: "Floor Count",
        value: property.houseDetails.floorCount,
      };
      propertyDetails.roomCount = {
        label: "Room Count",
        value: property.houseDetails.roomCount,
      };
      propertyDetails.hallAndKitchenAvailable = {
        label: "Hall And Kitchen Available",
        value:
          property.houseDetails.hallAndKitchenAvailable === true ? "Yes" : "No",
      };
      propertyDetails.waterSupply = {
        label: "Water Supply",
        value: property.houseDetails.waterSupply,
      };
      propertyDetails.electricity = {
        label: "Electricity",
        value: property.houseDetails.electricity,
      };
      propertyDetails.gatedSecurity = {
        label: "Gated Security",
        value: property.houseDetails.gatedSecurity === true ? "Yes" : "No",
      };
      propertyDetails.carParking = {
        label: "Car Parking",
        value: property.houseDetails.carParking === true ? "Yes" : "No",
      };
      propertyDetails.furnishingDetails = {
        label: "Furnishing Details",
        value: property.houseDetails.furnishingDetails,
      };
      propertyDetails.restroomCount = {
        label: "Restroom Count",
        value: property.houseDetails.restroomCount,
      };
    } else {
      propertyDetails.typesOfRooms = {
        label: "Types of Rooms",
        value: property.hostelDetails.typesOfRooms,
      };
      propertyDetails.genderPreference = {
        label: "Gender Preference",
        value: property.hostelDetails.genderPreference,
      };
      propertyDetails.wifi = {
        label: "Wifi",
        value: property.hostelDetails.wifi === true ? "Yes" : "No",
      };
      propertyDetails.food = {
        label: "Food",
        value: property.hostelDetails.food,
      };
      propertyDetails.gatedSecurity = {
        label: "Gated Security",
        value: property.hostelDetails.gatedSecurity === true ? "Yes" : "No",
      };
    }
  }
  if (property.propertyType == "Commercial") {
    propertyDetails.commercialType = {
      label: "CommercialType",
      value: property.commercialDetails.commercialType,
    };
    propertyDetails.floorCount = {
      label: "Floor Count",
      value: property.commercialDetails.floorCount,
    };
    propertyDetails.measurementUnit = {
      label: "Measurement Unit",
      value: property.commercialDetails.measurementUnit,
    };
    propertyDetails.width = {
      label: "Width",
      value: `${property.commercialDetails.width} ${
        measurementUnitMapValues[property.commercialDetails.measurementUnit]
      }`,
    };
    propertyDetails.length = {
      label: "Length",
      value: `${property.commercialDetails.length} ${
        measurementUnitMapValues[property.commercialDetails.measurementUnit]
      }`,
    };
    if (propertyDetails.height) {
      propertyDetails.height = {
        label: "Height",
        value: `${property.commercialDetails.height} ${
          measurementUnitMapValues[property.commercialDetails.measurementUnit]
        }`,
      };
    } else {
      propertyDetails.height = {
        label: "Height",
        value: "-",
      };
    }
    propertyDetails.waterSupply = {
      label: "Water Supply",
      value: property.commercialDetails.waterSupply,
    };
    propertyDetails.electricity = {
      label: "Electricity",
      value: property.commercialDetails.electricity,
    };
    propertyDetails.restroomCount = {
      label: "Restroom Count",
      value: property.commercialDetails.restroomCount,
    };
    propertyDetails.gatedSecurity = {
      label: "Gated Security",
      value: property.commercialDetails.gatedSecurity,
    };
    propertyDetails.carParking = {
      label: "Car Parking",
      value: property.commercialDetails.carParking,
    };
  }

  if (property.propertyType == "Land") {
    propertyDetails.measurementUnit = {
      label: "Measurement Unit",
      value: property.landDetails.measurementUnit,
    };
    propertyDetails.width = {
      label: "Width",
      value: `${property.landDetails.width} ${
        measurementUnitMapValues[property.landDetails.measurementUnit]
      }`,
    };
    propertyDetails.length = {
      label: "Length",
      value: `${property.landDetails.length} ${
        measurementUnitMapValues[property.landDetails.measurementUnit]
      }`,
    };
    propertyDetails.zoningType = {
      label: "Zoning Type",
      value: property.landDetails.zoningType,
    };
  }

  if (property.propertyType == "Product") {
    propertyDetails.productType = {
      label: "Product Type",
      value: property.productDetails.productType,
    };
    propertyDetails.manufacturer = {
      label: "Manufacturer",
      value: property.productDetails.manufacturer,
    };
    if (property.productDetails.warrantyPeriod !== 0) {
      propertyDetails.warrantyPeriod = {
        label: "Warranty Period",
        value: `${property.productDetails.warrantyPeriod} ${property.productDetails.warrantyUnit}`,
      };
    } else {
      propertyDetails.warrantyPeriod = {
        label: "Warranty Period",
        value: `-`,
      };
    }
    propertyDetails.warrantyUnit = {
      label: "Zoning Type",
      value: property.productDetails.warrantyUnit,
    };
  }

  return propertyDetails;
};

export const PropertyItemCardData = (property) => {
  const propertyDetails = GetPropertyDetails(property);

  const left = [];

  left.push(propertyDetails.propertyType);

  if (property.propertyCategory) {
    left.push(propertyDetails.propertyCategory);
  }

  left.push(propertyDetails.city);
  left.push(propertyDetails.state);

  if (property.listingType == "Sale") {
    left.push(propertyDetails.price);
  }

  if (property.listingType == "Rent") {
    left.push(propertyDetails.rent);
  }

  if (property.deposit) {
    left.push(propertyDetails.deposit);
  }

  const right = [];

  if (property.propertyCategory == "House") {
    right.push(propertyDetails.length);
    right.push(propertyDetails.width);
    right.push(propertyDetails.height);
    right.push(propertyDetails.roomCount);
    right.push(propertyDetails.hallAndKitchenAvailable);
  }

  if (property.propertyCategory == "Hostel") {
    right.push(propertyDetails.typesOfRooms);
    right.push(propertyDetails.food);
    right.push(propertyDetails.wifi);
  }

  if (property.propertyType == "Commercial") {
    right.push(propertyDetails.commercialType);
    right.push(propertyDetails.length);
    right.push(propertyDetails.width);
    right.push(propertyDetails.height);
    right.push(propertyDetails.floorCount);
  }

  if (property.propertyType == "Product") {
    right.push(propertyDetails.productType);
    right.push(propertyDetails.manufacturer);
    right.push(propertyDetails.warrantyPeriod);
  }

  if (property.propertyType == "Land") {
    right.push(propertyDetails.length);
    right.push(propertyDetails.width);
    right.push(propertyDetails.zoningType);
  }
  return { left, right };
};

export const PropertyDetailsCardData = (property) => {
  const propertyDetails = GetPropertyDetails(property);

  const basicLeft = [];
  const basicRight = [];
  const amenitiesLeft = [];
  const amenitiesRight = [];

  basicLeft.push(propertyDetails.propertyType);

  if (property.propertyCategory) {
    basicLeft.push(propertyDetails.propertyCategory);
  }

  basicLeft.push(propertyDetails.city);
  basicLeft.push(propertyDetails.state);

  if (property.propertyCategory == "House") {
    basicLeft.push(propertyDetails.listingType);

    if (property.listingType == "Sale") {
      basicLeft.push(propertyDetails.price);
    }

    if (property.listingType == "Rent") {
      basicLeft.push(propertyDetails.rent);
    }

    if (property.deposit) {
      basicLeft.push(propertyDetails.deposit);
    }

    basicRight.push(propertyDetails.length);
    basicRight.push(propertyDetails.width);
    basicRight.push(propertyDetails.height);
    basicRight.push(propertyDetails.roomCount);
    basicRight.push(propertyDetails.hallAndKitchenAvailable);
    basicRight.push(propertyDetails.floorCount);
    basicRight.push(propertyDetails.restroomCount);
    basicRight.push(propertyDetails.priceNegotiable);

    amenitiesLeft.push(propertyDetails.waterSupply);
    amenitiesLeft.push(propertyDetails.carParking);
    amenitiesLeft.push(propertyDetails.furnishingDetails);
    amenitiesRight.push(propertyDetails.electricity);
    amenitiesRight.push(propertyDetails.gatedSecurity);
  }

  if (property.propertyCategory == "Hostel") {
    basicRight.push(propertyDetails.listingType);

    if (property.listingType == "Sale") {
      basicRight.push(propertyDetails.price);
    }

    if (property.listingType == "Rent") {
      basicRight.push(propertyDetails.rent);
    }

    if (property.deposit) {
      basicRight.push(propertyDetails.deposit);
    }
    basicRight.push(propertyDetails.genderPreference);
    basicRight.push(propertyDetails.typesOfRooms);

    amenitiesLeft.push(propertyDetails.food);
    amenitiesLeft.push(propertyDetails.wifi);
    amenitiesRight.push(propertyDetails.gatedSecurity);
  }

  if (property.propertyType == "Commercial") {
    basicLeft.push(propertyDetails.listingType);

    if (property.listingType == "Sale") {
      basicLeft.push(propertyDetails.price);
    }

    if (property.listingType == "Rent") {
      basicLeft.push(propertyDetails.rent);
    }

    if (property.deposit) {
      basicLeft.push(propertyDetails.deposit);
    }

    basicLeft.push(propertyDetails.commercialType);
    basicRight.push(propertyDetails.length);
    basicRight.push(propertyDetails.width);
    basicRight.push(propertyDetails.height);
    basicRight.push(propertyDetails.floorCount);
    basicRight.push(propertyDetails.restroomCount);

    amenitiesLeft.push(propertyDetails.carParking);
    amenitiesLeft.push(propertyDetails.gatedSecurity);
    amenitiesRight.push(propertyDetails.waterSupply);
    amenitiesRight.push(propertyDetails.electricity);
  }

  if (property.propertyType == "Product") {
    basicLeft.push(propertyDetails.listingType);

    if (property.listingType == "Sale") {
      basicLeft.push(propertyDetails.price);
    }

    if (property.listingType == "Rent") {
      basicLeft.push(propertyDetails.rent);
    }

    if (property.deposit) {
      basicLeft.push(propertyDetails.deposit);
    }

    basicRight.push(propertyDetails.priceNegotiable);

    basicRight.push(propertyDetails.productType);
    basicRight.push(propertyDetails.manufacturer);
    basicRight.push(propertyDetails.warrantyPeriod);
  }

  if (property.propertyType == "Land") {
    basicRight.push(propertyDetails.listingType);

    if (property.listingType == "Sale") {
      basicRight.push(propertyDetails.price);
    }

    if (property.listingType == "Rent") {
      basicRight.push(propertyDetails.rent);
    }

    if (property.deposit) {
      basicRight.push(propertyDetails.deposit);
    }

    basicRight.push(propertyDetails.priceNegotiable);

    basicRight.push(propertyDetails.length);
    basicRight.push(propertyDetails.width);
    basicRight.push(propertyDetails.zoningType);
  }

  return { basicLeft, basicRight, amenitiesLeft, amenitiesRight };
};
