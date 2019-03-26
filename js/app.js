// On document ready
$(document).ready(function() {
  function fadeOnPageLoad() {
    // Fades on page load
    $('body').fadeIn(200).removeClass('hidden');
  }

  // Delays the page load and outputs to log
  _.delay(fadeOnPageLoad, 200, 'Content Shown');
});

// Auto-invoking function
$(function() {
  // If Device is mobile then parallax effect negates
  if (isMobile.phone || isMobile.tablet || isDeviceMobile()) {
    // Adds mobile-view class to body to change CSS for flattening view
    $('body').addClass('mobile-view');
  }

  // Initializes the admin navbar dropdown if user is logged in
  initAdminMenuDropdown();

  // Navbar Logo Redirect Override
  homepageOnClick();

  // $(window).on('scroll', function() {
  //   console.log($(window).scrollTop());
  // });
});

// Filter Toggle Listener Fn
function initFilterToggleListener() {
  // Open and closes fikters if they are in vertical mode
  // Otherwise the click will clear the filters
  $('.filters-toggle > div, button.filters-toggle').on('click', function() {
    if ($(this).hasClass('vertical')) {
      $(this).addClass('all-filters-toggled');
      clearFilters();
      clearProjectLinks();
    } else {
      clearFilters();
      clearProjectLinks();
    }
  });

  $('.filters-toggle > span').on('click', function(e) {
    e.preventDefault();
    toggleFilters();
    $(this).toggleClass('active');
  });
}

function checkAllWorkFilterOnLoad() {
  var activeFilters = $.makeArray($('.filter-toggle:checked'));

  if (!_.isEmpty(activeFilters)) {
    $('.filters-toggle').removeClass('all-filters-toggled');
  }
}

// Actual filtering logic fn
function initFilterListeners() {
  // Filters projects based on checkboxes
  // filterWorkFromCheckboxes();

  // On selection of one of more filters, run the filter logic
  $('.filter-toggle').on('change', function() {
    // Filter slug
    var sluggedFilter = $(this).data('slug');
    $('.filters-toggle').removeClass('all-filters-toggled');

    // Filters projects
    filterWorkFromCheckboxes();

    if (userIsInSingleWorkPage()) {
      // Handles the addition/deletion of query params on address
      handleFilterParams(sluggedFilter);
      handleFilteringNextPrevProjects();
    }
  });
}

// Returns true if user is in single work page
function userIsInSingleWorkPage() {
  if (location.search.split('work')[0] === '') {
    return false;
  }

  return true;
}

// Filters projects based on checkboxes
function filterWorkFromCheckboxes() {
  // Make array with checked filters
  var activeFilters = $.makeArray($('.filter-toggle:checked'));

  activeFilters = activeFilters.map(function(item) {
    return $(item).val();
  });

  // Check if all filters are on - that's the same as having All Projects enabled
  if (activeFilters.length === $('.filter-toggle').length || activeFilters.length === 0) {
    clearFilters();

    // clearProjectLinks();
  } else {
    filterWork(activeFilters);
  }
}

// Handles query params for filtering
function handleFilterParams(sluggedFilter) {
  // Reference to current active project
  var activeProject = bootstrap.activeProject.slug;

  // if there is 'filters' in address
  if (location.href.indexOf('filters') > -1) {
    // Update the filter query
    updateFilterParam(activeProject, sluggedFilter);
  } else {
    // Add filter query param
    addFilterParam(activeProject, sluggedFilter);
  }
}

// Adds query param to address
function addFilterParam(activeProject, sluggedFilter) {
  // Filtering state
  var stateObj = {
    filters: sluggedFilter,
  };

  // Actual params to be passed to route
  var params = activeProject + '?filters=' + sluggedFilter;

  // Pushes new state to the address location
  history.pushState(stateObj, 'Big Human', params);
}

// Updates and/or removes filter query params from address
function updateFilterParam(activeProject, sluggedFilter) {
  // Gets current filters and split into an array
  var filterString = location.search.split('filters=')[1];
  var filterArr = filterString.split(',');

  // Checks if currently selected filter's slug is on the filters array
  var isFilterInArray = _.find(filterArr, function(filters) {
    return filters === sluggedFilter;
  });

  var allFilters;
  var params;

  // if filter already exists
  if (isFilterInArray) {
    // Remove the currently selected filter's slug
    allFilters = _.without(filterArr, sluggedFilter);
  } else {
    // Adds currently selected filter's slug
    allFilters = _.union(filterArr, [
      sluggedFilter,
    ]);
  }

  // Join's array into a string
  var allFiltersString = allFilters.join();

  // If string is empty
  if (allFiltersString === '') {
    // Params aren't passed
    params = activeProject;

    // Filters are cleared
    clearFilters();
  } else {
    // if string isn't empty, pass it to address
    params = activeProject + '?filters=' + allFiltersString;
  }

  // filter state object
  var stateObj = {
    filters: allFiltersString,
  };

  // push to location address
  history.pushState(stateObj, 'Big Human', params);
}

// Filters projects
function filterWork(filterArr) {
  // Each of the project items (or list of project items)
  $('.work-item, .work-nav-link').each(function() {
    // Gets project tags and creates and array
    var tags = $(this).data('tags');
    var tagArr = tags.split(' ');

    // Finds common values between filters and project tags
    var intersections = _.intersection(tagArr, filterArr);

    // If exists, show item
    if (intersections.length) {
      $(this).show();
    } else {
      // else, hide the item
      $(this).hide();
    }
  });

  // Update the project link hrefs with the active filters
  updateProjectLinks(filterArr);

  // Add a filtered class to the body if items were filtered
  if ($('.work-item').length > $('.work-item:visible').length) {
    $('body').addClass('filtered');
  } else {
    $('body').removeClass('filtered');
  }
}

// Toggles the show-filters class on the body
function toggleFilters() {
  // Displays or hides the list of filters
  $('body').toggleClass('show-filters');
}

// Clears the filter selection
function clearFilters() {
  $('.filters-toggle').addClass('all-filters-toggled');
  $('.filter-toggle').prop('checked', false);
  $('.work-item').show();
  $('.work-nav-link').show();
  $('body').removeClass('filtered');
}

// Reset the project link hrefs
function clearProjectLinks() {
  updateProjectLinks([]);
}

// Set a query string on all project links to pass the active filter selection
// filterArr = The array of filter items to be stringified and added to the link hrefs
function updateProjectLinks(filterArr) {
  // Stringifies the array of filters
  var filterString = filterArr.join();

  // console.log('filters: ' + filterString);
  // console.log('runs once');

  $('.work-item-link, .next-project-prompt > a, .work-nav-link > a').each(function() {
    // Gets href attribute
    var newHref;
    var href = $(this).attr('href');

    // console.log('href: ' + href);
    var hasFilters = href.split('=')[1];
    var hrefArr = href.split('?');

    // console.log('hrefArr: ' + hrefArr);

    // if filterArr exists, input new href attribute
    if (filterArr.length) {
      newHref = hrefArr[0] + '?filters=' + filterString;

      // console.log('touches: ' + newHref);
    } else {
      // otherwise, leave as is
      newHref = hrefArr[0];

      // console.log('does not touch: ' + newHref);
    }
    // Actually attributes the new href to the object
    // console.log('newHref:' + newHref);
    $(this).attr('href', newHref);
  });
}

// Same as updateProjectLinks() but on runs on page load
function updateProjectLinksOnLoad() {
  $('.work-item-link, .next-project-prompt > a, .work-nav-link > a').each(function() {
    if ($(this).children().hasClass('start-filter-list') || $(this).children().hasClass('end-filter-list')) {
      var blankHref = '';
      $(this).attr('href', blankHref);
    } else {
      // Gets href attribute
      var newHref;
      var href = $(this).attr('href');
      var filterString = location.search.split('filters=')[1] || '';

      if (filterString !== '') {
        newHref = href + '?filters=' + filterString;
      } else {
        newHref = href;
      }

      // console.log('newHref on load: ' + newHref);

      // Actually attributes the new href to the object
      $(this).attr('href', newHref);
    }
  });
}

// Single Page Sidebar Specific
// ============================

function handleSidebarListFilter() {
  // Creates empty array
  var filteredProjects = [];

  // for each project, check if project id is in filtered array
  _.each(bootstrap.projects, function(project) {
    var projectId = isProjectInFilteredIds(project.id, bootstrap.filteredIds);

    // pushes projectId to the filteredProjects array
    filteredProjects.push(projectId);
  });

  // Removes any instances of '-1' from the array
  filteredProjects = _.without(filteredProjects, -1);

  // If the array is empty (length 0)
  if (filteredProjects.length === 0) {
    // Show all projects
    $('.work-nav-link').show();

    // Unchecks all checkboxes/filters
    $('.filter-toggle').prop('checked', false);
  } else {
    // if array is not empty, hide the unfiltered projects
    hideUnfilteredProjects(filteredProjects);
  }

  // Is projectId in the filteredId array
  function isProjectInFilteredIds(projectId, filteredIds) {
    // Finds indexOf projectId
    var projectIsValid = _.indexOf(filteredIds, projectId);

    // If true return projectId
    if (projectIsValid > -1) {
      return projectId;
    } else { // eslint-disable-line
      // if false return -1
      return -1;
    }
  }

  // Hides projects that don't match filtering criteria
  function hideUnfilteredProjects(filteredProjectIds) {
    // If array is empty, show all projects
    if (filteredProjectIds === '') {
      $('.work-nav-link').hide();
    } else {
      // hide project items that match the id criteria
      _.each(filteredProjectIds, function(projectId) {
        $('li#' + projectId + '.work-nav-link').show();
      });
    }
  }

  // Gets previously selected filters from the address bar
  function getSelectedFilters() {
    var filtersFromHref;
    var filtersArr;

    // If 'filters' exist
    if (location.search.split('filters=')[0] === '?') {
      // Gets filters from the address location
      filtersFromHref = location.search.split('filters=')[1];

      // Splits filters by comma and put it in an array
      filtersArr = filtersFromHref.split(',');

      // Returns array
      return filtersArr;
    } else if (location.search.split('filters=')[0] === '') {
      // If no filters come from address params
      filtersFromHref = '';

      // Returns empty array
      return filtersFromHref;
    }
  }

  // Gets array of filters
  var filtersArr = getSelectedFilters();

  // Toggles selected filters that are in the filters array
  togglesSelectedFilters(filtersArr);

  // If array isn't empty, activate each slugged filter
  function togglesSelectedFilters(filtersArr) { // eslint-disable-line
    if (filtersArr === '') {
      $('.filter-toggle').prop('checked', false);
    } else {
      _.each(filtersArr, function(filterSlug) {
        $('#filter-toggle__' + filterSlug).prop('checked', true);
      });
    }
  }
}

// Handles the updating of next/prev projects based on current filters
function handleFilteringNextPrevProjects() {
  // Selected Filter Slugs
  var filters = getFilters();

  // Current Active Project
  var activeProject = getActiveProject();

  // Array of all projects
  var projectsArray = bootstrap.projects;
  var projectsLen = projectsArray.length;
  var nextProject;
  var prevProject;

  if (getFilters()) {
    // Array of filtered projects based on current nexfilters
    var filteredProjectsArray = filterProjectsByTags(projectsArray, filters);

    // Current active Project's indexOf based on filtered projects
    var activeProjectIndexInFilteredProjects = getIndexInArr(
      filteredProjectsArray,
      activeProject.slug
    );

    // Next and Prev projects based on filtered projects array
    nextProject = getNextFilteredProject(
      activeProjectIndexInFilteredProjects,
      filteredProjectsArray
    );

    prevProject = getPrevFilteredProject(
      activeProjectIndexInFilteredProjects,
      filteredProjectsArray
    );
  } else {
    // Current active Project's indexOf based on all projects
    var activeProjectIndexInAllProjects = getIndexInArr(projectsArray, activeProject.slug);

    // Next and Prev projects based on all projects array
    nextProject = getNextProject(activeProjectIndexInAllProjects, projectsArray);
    prevProject = getPrevProject(activeProjectIndexInAllProjects, projectsArray);
  }

  applyNewNextProject(nextProject);
  applyNewPrevProject(prevProject);

  // updateProjectLinksOnLoad();

  // Makes DOM changes to the next project tile
  function applyNewNextProject(nextProject) { // eslint-disable-line
    var newHref = nextProject.slug;

    // console.log(newHref);
    var newImage = nextProject.image.filename;

    // console.log(newImage);
    var newName = nextProject.name;

    if (newHref === '/work') {
      $('.next-work').addClass('end-filter-list');
    } else {
      $('.next-work').removeClass('end-filter-list');
    }

    $('.next-work').parent().attr('href', newHref);
    $('.next-work-background').attr('style', 'background-image: url(https://d3dtpuq3m22yne.cloudfront.net/images/main/' + newImage + ')');
    $('.next-project-title').html(newName);
  }

  // Makes DOM changes to the prev project tile
  function applyNewPrevProject(prevProject) { // eslint-disable-line
    var newHref = prevProject.slug;
    var newImage = prevProject.image.filename;
    var newName = prevProject.name;

    if (newHref === '/work') {
      $('.prev-work').addClass('start-filter-list');
    } else {
      $('.prev-work').removeClass('start-filter-list');
    }

    $('.prev-work').parent().attr('href', newHref);
    $('.prev-work-background').attr('style', 'background-image: url(https://d3dtpuq3m22yne.cloudfront.net/images/main/' + newImage + ')');
    $('.prev-project-title').html(newName);
  }

  // Gets next project in filtered array
  function getNextFilteredProject(projectIndex, projectsArray) { // eslint-disable-line
    var projectsLen = projectsArray.length; // eslint-disable-line
    var nextProject = projectsArray[projectIndex + 1]; // eslint-disable-line

    var endOfFilteredList = {
      slug: '/work',
      name: 'FIN',
      image: {
        filename: 'black_1452612969.png',
      },
    };

    if (!nextProject) {
      nextProject = endOfFilteredList;
      removeFiltersFromAddress();
    }

    return nextProject;
  }

  // Gets prev project in filtered array
  function getPrevFilteredProject(projectIndex, projectsArray) { // eslint-disable-line
    var projectsLen = projectsArray.length; // eslint-disable-line
    var prevProject = projectsArray[projectIndex - 1]; // eslint-disable-line

    var startOfFilteredList = {
      slug: '/work',
      name: 'START',
      image: {
        filename: 'black_1452612969.png',
      },
    };

    if (!prevProject) {
      prevProject = startOfFilteredList;
      removeFiltersFromAddress();
    }

    return prevProject;
  }

  // Gets previous projects in array
  function getNextProject(projectIndex, projectsArray) { // eslint-disable-line
    return projectsArray[projectIndex + 1] || projectsArray[0];
  }

  // Gets previous projects in array
  function getPrevProject(projectIndex, projectsArray) { // eslint-disable-line
    return projectsArray[projectIndex - 1] || projectsArray[projectsArray.length - 1];
  }

  // Gets current filter selection based on the address bar
  function getFilters() {
    return location.search.split('filters=')[1];
  }

  // Gets current active project document
  function getActiveProject() {
    return bootstrap.activeProject;
  }

  function removeFiltersFromAddress() {
    // if string isn't empty, pass it to address
    var params = '';

    // filter state object
    var stateObj = {
      filters: 'NA',
    };

    // push to location address
    history.pushState(stateObj, 'Big Human', params);
  }

  // Filters an array of projects and returns those that match the filtered criteria
  function filterProjectsByTags(projectsArray, tags) { // eslint-disable-line
    var tagsArr = tags.split(',');
    return projectsArray.filter(function(project) {
      var projectTags = getProjectDataTags(project).split(' ');
      for (var i = 0; i < tagsArr.length; i++) {
        if (projectTags.indexOf(tagsArr[i]) >= 0) {
          return true;
        }
      }

      return false;
    });
  }

  // Gets filters/tags on inidividual project
  function getProjectDataTags(project) {
    return project.tags.map(function(tag) {
      return tag.slug;
    }).join(' ');
  }

  // Gets project index on array of projects
  function getIndexInArr(projectsArray, projectSlug) { // eslint-disable-line
    for (var i = 0; i < projectsArray.length; i++) {
      var project = projectsArray[i];
      if (project.slug === projectSlug) {
        return i;
      }
    }
  }
}
