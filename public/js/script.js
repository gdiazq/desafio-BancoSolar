const setInfoModal = (nombre, balance, id) => {
  $("#nombreEdit").val(nombre);
  $("#balanceEdit").val(balance);
  $("#editButton").attr("onclick", `editUsuario('${id}')`);
};

const editUsuario = async (id) => {
    const nombre = $("#nombreEdit").val();
    const balance = $("#balanceEdit").val();
    try {
        await axios.put(
          `http://localhost:3000/usuario`,
            {
            id,
            nombre,
            balance,
            }
        );
        $("#exampleModal").modal("hide");
        location.reload();
    } catch (e) {
      alert("Algo salió mal..." + e);
    }
};

$("form:first").submit(async (e) => {
    e.preventDefault();
    let nombre = $("form:first input:first").val();
    let balance = Number($("form:first input:nth-child(2)").val());
    if (!nombre || !balance) {
      alert("Debe ingresar un nombre y un balance para el usuario.");
      return false;
    }
    if (!/^[A-Za-z]+$/.test(nombre)) {
      alert("El nombre solo debe contener letras y no debe contener puntos ni espacios.");
      return false;
    }
    if (isNaN(balance)) {
      alert("El balance debe ser un número válido.");
      return false;
    }
    if (balance < 0) {
      alert("El balance no puede ser negativo.");
      return false;
    }
    try {
      await axios.post("http://localhost:3000/usuario", {
          nombre,
          balance,
      });
      $("form:first input:first").val("");
      $("form:first input:nth-child(2)").val("");
      location.reload();
    } catch (e) {
      alert("Algo salió mal ..." + e);
    }
});

$("form:last").submit(async (e) => {
    e.preventDefault();
    let emisor = $("form:last select:first").val();
    let receptor = $("form:last select:last").val();
    let monto = parseFloat($("#monto").val());
    if (!monto || !emisor || !receptor) {
      alert("Debe seleccionar un emisor, receptor y monto a transferir");
      return false;
    }
    if (emisor === receptor) {
      alert("El emisor y el receptor no pueden ser el mismo usuario");
      return false;
    }
    if (isNaN(monto)) {
      alert("El monto debe ser un número válido.");
      return false;
    }
    if (monto < 0) {
      alert("El monto no puede ser negativo.");
      return false;
    } 
    try {
      await axios.post("http://localhost:3000/transferencia", {
          emisor,
          receptor,
          monto,
      });
      location.reload();
    } catch (e) {
      console.log(e);
      alert("Algo salió mal..." + e);
    }
});

const formatNumber = (number) => {
  return Number(number).toLocaleString('es-CL');
};

const getUsuarios = async () => {
    const response = await axios.get("http://localhost:3000/usuarios");
    let data = await response.data;
    $(".usuarios").html("");

    $.each(data, (i, c) => {
      $(".usuarios").append(`
              <tr>
                <td>${c.nombre}</td>
                <td>${formatNumber(c.balance)}</td>
                <td>
                  <button
                    class="btn btn-warning mr-2"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onclick="setInfoModal('${c.nombre}', '${c.balance}', '${c.id}')"
                  >
                    Editar</button
                  ><button class="btn btn-danger" onclick="eliminarUsuario('${c.id}')">Eliminar</button>
                </td>
              </tr>
         `);

      $("#emisor").append(`<option value="${c.nombre}">${c.nombre}</option>`);
      $("#receptor").append(`<option value="${c.nombre}">${c.nombre}</option>`);
    });
};

const eliminarUsuario = async (id) => {
    await axios.delete(`http://localhost:3000/usuario?id=${id}`, {
      method: "DELETE",
    });
    getUsuarios();
};

const getTransferencias = async () => {
  try {
      const { data } = await axios.get("http://localhost:3000/transferencias");
      $(".transferencias").html("");

      data.forEach((t) => {
          $(".transferencias").append(`
              <tr>
                  <td> ${formatDate(t.fecha)} </td>
                  <td> ${t.nombre_emisor} </td>
                  <td> ${t.nombre_receptor} </td>
                  <td> ${formatNumber(t.monto)} </td>
              </tr>
          `);
      });
  } catch (error) {
      console.error("Error al obtener las transferencias:", error);
  }
};

getUsuarios();
getTransferencias();

const formatDate = (date) => {
    const dateFormat = moment(date).format("L");
    const timeFormat = moment(date).format("LTS");
    return `${dateFormat} ${timeFormat}`;
};
formatDate();