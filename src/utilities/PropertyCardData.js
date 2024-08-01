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
    value: property.priceNegotiable,
  };
  propertyDetails.price = {
    label: "Price",
    value: `${property.price} ${property.currency}`,
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
    value: property.deposit,
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
        value: `${property.houseDetails.length} ${property.houseDetails.measurementUnit}`,
      };
      propertyDetails.width = {
        label: "Width",
        value: `${property.houseDetails.width} ${property.houseDetails.measurementUnit}`,
      };
      propertyDetails.height = {
        label: "Height",
        value: `${property.houseDetails.height} ${property.houseDetails.measurementUnit}`,
      };
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
        value: property.houseDetails.hallAndKitchenAvailable,
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
        value: property.houseDetails.gatedSecurity,
      };
      propertyDetails.carParking = {
        label: "Car Parking",
        value: property.houseDetails.carParking,
      };
      propertyDetails.furnishingDetails = {
        label: "Furnishing Details",
        value: property.houseDetails.furnishingDetails,
      };
    } else {
      propertyDetails.typesOfRooms = {
        label: "Types Of Rooms",
        value: property.hostelDetails.typesOfRooms,
      };
      propertyDetails.genderPreference = {
        label: "Gender Preference",
        value: property.hostelDetails.genderPreference,
      };
      propertyDetails.wifi = {
        label: "Wifi",
        value: property.hostelDetails.wifi,
      };
      propertyDetails.gatedSecurity = {
        label: "Gated Security",
        value: property.hostelDetails.gatedSecurity,
      };
    }
  }
  if (property.propertyType == "Commercial") {
    propertyDetails.commercialType = {
      label: "CommercialType",
      value: property.commercialDetails.commercialType,
    };
    propertyDetails.floorCount = {
      label: "FloorCount",
      value: property.commercialDetails.floorCount,
    };
    propertyDetails.measurementUnit = {
      label: "Measurement Unit",
      value: property.commercialDetails.measurementUnit,
    };
    propertyDetails.length = {
      label: "Length",
      value: property.commercialDetails.length,
    };
    propertyDetails.width = {
      label: "Width",
      value: property.commercialDetails.width,
    };
    propertyDetails.height = {
      label: "Height",
      value: property.commercialDetails.height,
    };
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
    propertyDetails.length = {
      label: "Length",
      value: property.landDetails.length,
    };
    propertyDetails.width = {
      label: "Width",
      value: property.landDetails.width,
    };
    propertyDetails.zoningType = {
      label: "Zoning Type",
      value: property.landDetails.zoningType,
    };
  }

  if (property.propertyType == "Product") {
    propertyDetails.productType = {
      label: "Zoning Type",
      value: property.productDetails.productType,
    };
    propertyDetails.manufacturer = {
      label: "Zoning Type",
      value: property.productDetails.manufacturer,
    };
    propertyDetails.warrantyPeriod = {
      label: "Zoning Type",
      value: property.productDetails.warrantyPeriod,
    };
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

  const right = [];

  if (property.listingType == "Sale") {
    right.push(propertyDetails.price);
  }

  if (property.listingType == "Rent") {
    right.push(propertyDetails.rent);
  }

  if (property.length) {
    right.push(propertyDetails.length);
  }
  if (property.width) {
    right.push(propertyDetails.width);
  }

  if (property.height) {
    right.push(propertyDetails.height);
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

  basicRight.push(propertyDetails.listingType)

  if (property.listingType == "Sale") {
    basicRight.push(propertyDetails.price);
  }

  if (property.listingType == "Rent") {
    basicRight.push(propertyDetails.rent);
  }

  if (property.length) {
    basicRight.push(propertyDetails.length);
  }
  if (property.width) {
    basicRight.push(propertyDetails.width);
  }

  if (property.height) {
    basicRight.push(propertyDetails.height);
  }

  return { basicLeft, basicRight, amenitiesLeft, amenitiesRight };
};
