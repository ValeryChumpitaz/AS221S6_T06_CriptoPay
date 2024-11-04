// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MoviBusPay
 * @dev El contrato permite a los usuarios pagar por un servicio de transporte y gestiona los pagos a cualquier contratista de transporte.
 */
contract MoviBusPay {

    /**
     * @dev Estructura para almacenar información de un pago.
     * @param user La dirección del usuario que realiza el pago.
     * @param amount La cantidad de ETH pagada.
     * @param contractor La dirección del contratista que recibe el pago.
     * @param paid Indica si el pago ha sido realizado.
     */
    struct Payment {
        address user;
        uint256 amount;
        address contractor;
        bool paid;
    }

    /// @dev Lista de todos los pagos realizados.
    Payment[] public payments;

    /**
     * @notice Evento que se dispara cuando se recibe un pago.
     * @param user La dirección del usuario que realizó el pago.
     * @param amount La cantidad de ETH pagada.
     * @param contractor La dirección del contratista que recibe los fondos.
     */
    event PaymentReceived(address indexed user, uint256 amount, address indexed contractor);

    /**
     * @notice Evento que se dispara cuando un pago es reembolsado.
     * @param user La dirección del usuario que recibe el reembolso.
     * @param amount La cantidad de ETH reembolsada.
     */
    event PaymentRefunded(address indexed user, uint256 amount);

    /**
     * @notice Permite a un usuario pagar por un servicio de transporte a cualquier contratista.
     * @dev La función almacena el pago en la lista `payments` y transfiere la cantidad a la dirección del contratista.
     * @param _contractor La dirección del contratista a la que se enviarán los fondos.
     * @custom:require El valor de ETH enviado debe ser mayor a 0.
     */
    function payForBusRide(address _contractor) public payable {
        require(msg.value > 0, "Debe enviar ETH para pagar el servicio.");
        require(_contractor != address(0), "Direccion de contratista no valida.");

        payments.push(Payment({
            user: msg.sender,
            amount: msg.value,
            contractor: _contractor,
            paid: true
        }));

        payable(_contractor).transfer(msg.value);

        emit PaymentReceived(msg.sender, msg.value, _contractor);
    }

    /**
     * @notice Verifica si un usuario ha realizado un pago a un contratista.
     * @param _user La dirección del usuario a consultar.
     * @param _contractor La dirección del contratista a consultar.
     * @return Un valor booleano que indica si el usuario ha pagado al contratista.
     */
    function hasPaid(address _user, address _contractor) public view returns (bool) {
        for (uint256 i = 0; i < payments.length; i++) {
            if (payments[i].user == _user && payments[i].contractor == _contractor && payments[i].paid) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Devuelve la cantidad total de pagos almacenados.
     * @return El número total de pagos registrados.
     */
    function getTotalPayments() public view returns (uint256) {
        return payments.length;
    }
}
