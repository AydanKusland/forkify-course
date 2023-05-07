import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import bookmarksView from './views/bookmarksView.js'
import paginationView from './views/paginationView.js'
import addRecipeView from './views/addRecipeView.js'
import { MODAL_CLOSE_SEC } from './config.js'

import 'core-js/stable'
import 'regenerator-runtime'

if (module.hot) {
	module.hot.accept()
}

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1)

		if (!id) return
		recipeView.renderSpinner()

		// 0. Update results view to mark selected search result
		resultsView.update(model.getSearchResultsPage())

		// 1. Updating bookmarks
		bookmarksView.update(model.state.bookmarks)

		// 2. Loading the recipe
		await model.loadRecipe(id)
		const { recipe } = model.state

		// 3. Rendering the recipe
		recipeView.render(recipe)
	} catch (error) {
		recipeView.renderError()
	}
}

const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner()

		// 1) Get search query
		const query = searchView.getQuery()
		if (!query) return

		// 2) Load search results
		await model.loadSearchResults(query)

		// 3) Render results
		resultsView.render(model.getSearchResultsPage())

		// 4) Render initial pagination buttons
		paginationView.render(model.state.search)
	} catch (error) {
		console.log(error)
	}
}

const controlPagination = function (goToPage) {
	// 1) Render new results
	resultsView.render(model.getSearchResultsPage(goToPage))
	// 2) Render NEW pagination buttons
	paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
	// Update the recipe servings (in state)
	model.updateServings(newServings)
	// Update the recipe view
	// recipeView.render(model.state.recipe)
	recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
	// 1. Add/remove bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
	else model.deleteBookmark(model.state.recipe.id)
	// 2. Update recipe view
	recipeView.update(model.state.recipe)
	// 3. Render bookmarks
	bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
	try {
		// Show spinner
		addRecipeView.renderSpinner()
		// upload new recipe data
		await model.uploadRecipe(newRecipe)

		// render recipe
		recipeView.render(model.state.recipe)

		// Success message
		addRecipeView.renderMessage()

		// Render bookmark view
		bookmarksView.render(model.state.bookmarks)

		// Change ID in URL
		window.history.pushState(null, '', `#${model.state.recipe.id}`)

		// Close form window
		setTimeout(() => {
			addRecipeView.toggleWindow()
		}, MODAL_CLOSE_SEC * 1000)
	} catch (error) {
		console.error('🤯🤯🤯🤯🤯', error)
		addRecipeView.renderError(error.message)
	}
}

function init() {
	bookmarksView.addHandlerRender(controlBookmarks)
	recipeView.addHandlerRender(controlRecipes)
	recipeView.addHandlerUpdateServings(controlServings)
	searchView.addHandlerSearch(controlSearchResults)
	paginationView.addHandlerClick(controlPagination)
	recipeView.addHandlerAddBookmark(controlAddBookmark)
	addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()
