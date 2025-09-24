export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getUniqueYears = (launches) => {
  const years = launches.map((launch) =>
    new Date(launch.date_local).getFullYear()
  );
  return [...new Set(years)].sort((a, b) => b - a);
};

export const filterLaunches = (launches, filters) => {
  return launches.filter((launch) => {
    const matchesSearch =
      !filters.search ||
      launch.name.toLowerCase().includes(filters.search.toLowerCase());

    const matchesYear =
      !filters.year ||
      new Date(launch.date_local).getFullYear() === parseInt(filters.year);

    const matchesSuccess =
      filters.success === "all" ||
      (filters.success === "success" && launch.success === true) ||
      (filters.success === "failed" && launch.success === false);

    const matchesFavorites =
      !filters.favoritesOnly || filters.favorites.includes(launch.id);

    return matchesSearch && matchesYear && matchesSuccess && matchesFavorites;
  });
};

export const sortLaunchesByDate = (launches, sortOrder = "newest") => {
  return [...launches].sort((a, b) => {
    const dateA = new Date(a.date_local);
    const dateB = new Date(b.date_local);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
