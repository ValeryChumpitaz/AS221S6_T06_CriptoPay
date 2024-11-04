# CONTRATO .SOL
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MoviBusPay
 * @dev El contrato permite a los usuarios pagar por un servicio de transporte, gestiona los pagos a contratistas de transporte,
 * y ofrece un sistema de recompensas por referidos y bonificaciones por frecuencia.
 */
contract MoviBusPay {
    struct Payment {
        address user;
        uint256 amount;
        address contractor;
        bool paid;
    }

    struct User {
        address referrer;
        uint256 totalRides;
        uint256 points;
    }

    Payment[] public payments;
    mapping(address => User) public users;

    event PaymentReceived(address indexed user, uint256 amount, address indexed contractor);
    event PointsEarned(address indexed user, uint256 amount);
    event Referred(address indexed referrer, address indexed referred);

    /**
     * @notice Permite a un usuario pagar por un servicio de transporte a cualquier contratista.
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

        // Actualizar información del usuario
        users[msg.sender].totalRides++;

        // Gana puntos (1 punto por cada 1 ETH gastado)
        uint256 earnedPoints = msg.value;
        users[msg.sender].points += earnedPoints;

        // Lógica de bonificación
        if (users[msg.sender].totalRides % 5 == 0) { // Cada 5 viajes
            users[msg.sender].points += 5; // Bonificación de 5 puntos
            emit PointsEarned(msg.sender, 5);
        }

        // Recompensa al referido
        if (users[msg.sender].referrer != address(0)) {
            users[users[msg.sender].referrer].points += earnedPoints / 10; // 10% de recompensa
            emit PointsEarned(users[msg.sender].referrer, earnedPoints / 10);
        }

        payable(_contractor).transfer(msg.value);
        emit PaymentReceived(msg.sender, msg.value, _contractor);
    }

    /**
     * @notice Registra un referidor para el usuario.
     * @param _referrer La dirección del referidor.
     */
    function registerReferrer(address _referrer) public {
        require(users[msg.sender].referrer == address(0), "Ya te has registrado.");
        require(_referrer != msg.sender, "No puedes referirte a ti mismo.");

        users[msg.sender].referrer = _referrer;
        emit Referred(_referrer, msg.sender);
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

    /**
     * @notice Devuelve los detalles de un pago específico.
     * @param index El índice del pago que se desea consultar.
     * @return user La dirección del usuario que realizó el pago.
     * @return amount La cantidad de ETH pagada.
     * @return contractor La dirección del contratista que recibió el pago.
     * @return paid Indica si el pago ha sido realizado.
     */
    function getPaymentDetails(uint256 index) public view returns (address user, uint256 amount, address contractor, bool paid) {
        require(index < payments.length, "Index fuera de rango");
        Payment memory payment = payments[index];
        return (payment.user, payment.amount, payment.contractor, payment.paid);
    }

    /**
     * @notice Devuelve la cantidad total de puntos de un usuario.
     * @param user La dirección del usuario a consultar.
     * @return El número total de puntos acumulados.
     */
    function getUserPoints(address user) public view returns (uint256) {
        return users[user].points;
    }

    /**
     * @notice Devuelve el total de viajes realizados por un usuario.
     * @param user La dirección del usuario a consultar.
     * @return El número total de viajes realizados.
     */
    function getUserTotalRides(address user) public view returns (uint256) {
        return users[user].totalRides;
    }
}

```
