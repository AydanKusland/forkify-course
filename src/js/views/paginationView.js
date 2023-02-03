import View from './View'
import icons from 'url:../../img/icons.svg'

class paginationView extends View {
	_parentElement = document.querySelector('.pagination')

	addHandlerClick(handler) {
		this._parentElement.addEventListener('click', function (e) {
			const btn = e.target.closest('.btn--inline')
			if (!btn) return
			const goToPage = +btn.dataset.goto
			handler(goToPage)
		})
	}

	_generateMarkup() {
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		)
		const curPage = this._data.page
		// Page 1, other pages
		if (curPage === 1 && numPages > 1) {
			return `<button data-goto="${
				curPage + 1
			}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
		}
		if (curPage === numPages && numPages > 1) {
			// Last Page
			return `<button data-goto="${
				curPage - 1
			}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`
		}
		// All pages in between
		if (curPage < numPages) {
			return `<button data-goto="${
				curPage - 1
			}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          <button data-goto="${
						curPage + 1
					}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
		}
		// Page 1. no others
		return ''
	}
}

export default new paginationView()
