$(document).ready(function () {
  const tableDim = 10;
  const cellOptions = {
    empty: 'empty',
    ship: 'ship',
    hit: 'hit',
    miss: 'miss',
  };

  const shipsConfig = {
    "ship-vertical-size-2": {
      dimension: { row: 2, col: 1 },
      position: [{ i: -1, j: 0 }, { i: 0, j: 0 }]

    },
    "ship-horizontal-size-3": {
      dimension: { row: 1, col: 3 },
      position: [{ i: 0, j: -1 }, { i: 0, j: 0 }, { i: 0, j: 1 }],
    },
    "ship-vertical-size-4": {
      dimension: { row: 4, col: 1 },
      position: [{ i: -2, j: 0 }, { i: -1, j: 0 }, { i: 0, j: 0 }, { i: 1, j: 0 }]
    },
    "ship-horizontal-size-5": {
      dimension: { row: 1, col: 5 },
      position: [{ i: 0, j: -2 }, { i: 0, j: -1 }, { i: 0, j: 0 }, { i: 0, j: 1 }, { i: 0, j: 2 }],
    },
  };

  const players = {
    player1: {
      name: 'player1',
      table: initializeMatrices(tableDim, cellOptions.empty),
    },
    player2: {
      name: 'player2',
      table: initializeMatrices(tableDim, cellOptions.empty),
    }
  };

  function initializeMatrices(length, defaultValue) {
    let matrix = [];
    for (let rowIndex = 0; rowIndex < length; rowIndex++) {
      matrix.push([]);
      for (let columnIndex = 0; columnIndex < length; columnIndex++) {
        matrix[rowIndex][columnIndex] = defaultValue;
      }
    }
    return matrix;
  }

  function renderTable(player) {
    let tableBody = '';
    let tableRow = '';

    $(`table.${player.name}-table tbody`).empty();

    for (let rowIndex = 0; rowIndex < tableDim; rowIndex++) {
      tableRow = `<tr class="table-row">`;
      for (let columnIndex = 0; columnIndex < tableDim; columnIndex++) {
        tableRow += `
          <td class="table-cell table-cell-${player.table[rowIndex][columnIndex]}" i='${rowIndex}' j='${columnIndex}'>
            <div class="table-cell-content">`;

        if (columnIndex === 0) {
          // tableRow += `<div class="marker-row">${rowIndex + 1}</div>`;
          tableRow += `<div class="marker-row">${rowIndex}</div>`;
        }
        if (rowIndex === 0) {
          // tableRow += `<div class="marker-col">${String.fromCharCode('A'.charCodeAt(0) + columnIndex)}</div>`;
          tableRow += `<div class="marker-col">${columnIndex}</div>`;
        }
        tableRow += `
            </div>
          </td>`;
      }
      tableRow += "</tr>";
      tableBody += tableRow;
    }
    $(`.game-table-section table.${player.name}-table tbody`).append(tableBody);
  }

  function renderShips(shipsConfig) {
    let htmlShips = '';
    Object.keys(shipsConfig).map((key) => {
      const shipRow = shipsConfig[key].dimension.row;
      const shipCol = shipsConfig[key].dimension.col;
      htmlShips += `<table class="ship ${key}"><tbody>`;

      for (let rowIndex = 0; rowIndex < shipRow; rowIndex++) {
        htmlShips += `<tr>`
        for (let colIndex = 0; colIndex < shipCol; colIndex++) {
          htmlShips += `<td></td>`
        }
        htmlShips += `</tr>`
      }
      htmlShips += `</tbody> </table>`;
    });

    $('.ships-container').append(htmlShips);
  }

  renderTable(players.player1);
  // renderTable(players.player2);
  renderShips(shipsConfig);


  $(document.body).on('click', '.table-cell', function (evt) {
    const i = parseInt($(this).attr('i'));
    const j = parseInt($(this).attr('j'));
    console.log(i, j);

    // const playerClass = $(this).closest('table').attr('class');
    players.player1.table[i][j] = players.player1.table[i][j] === cellOptions.ship ? cellOptions.hit : cellOptions.miss;
    renderTable(players.player1);
    $(".table-cell.table-cell-empty").droppable(droppableObject);
  });



  $(".ship-vertical-size-2, .ship-horizontal-size-3, .ship-vertical-size-4, .ship-horizontal-size-5").draggable();

  const droppableObject = {
    drop: function (event, ui) {
      const i = parseInt($(this).attr('i'));
      const j = parseInt($(this).attr('j'));
      const draggedElement = $(ui.draggable[0]).attr('class').split(' ')[1];

      $(`.${draggedElement}`).remove();
      shipsConfig[draggedElement].position.map((config) => {
        players.player1.table[i + config.i][j + config.j] = cellOptions.ship;
      });

      renderTable(players.player1);
      $(".table-cell.table-cell-empty").droppable(droppableObject);
    },
    over: function (event, ui) {
      const i = parseInt($(this).attr('i'));
      const j = parseInt($(this).attr('j'));

      const draggedElement = $(ui.draggable[0]).attr('class').split(' ')[1];
      shipsConfig[draggedElement].position.map((config) => {
        $(`.player1-table .table-cell.table-cell-empty[i="${i + config.i}"][j="${j + config.j}"]`).css('background', '#C8E3CA');
      });

    },
    out: function (event, ui) {
      const i = parseInt($(this).attr('i'));
      const j = parseInt($(this).attr('j'));

      const draggedElement = $(ui.draggable[0]).attr('class').split(' ')[1];
      shipsConfig[draggedElement].position.map((config) => {
        $(`.player1-table .table-cell.table-cell-empty[i="${i + config.i}"][j="${j + config.j}"]`).css('background', '#ffffff');
      });
    }
  }
  $(".table-cell.table-cell-empty").droppable(droppableObject);





});

