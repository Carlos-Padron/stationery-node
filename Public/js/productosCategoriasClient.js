document.addEventListener('DOMContentLoaded', () => {
    console.log('get ready');

    const main_columns = [
        { data: '...', className: 'text-center' },
        { data: '..', className: 'text-center' },
        { data: '.', className: 'text-center' }
    ];

    var data = []


    console.log(SITE);

    initializeDataTable('mainTable', data, main_columns)
})