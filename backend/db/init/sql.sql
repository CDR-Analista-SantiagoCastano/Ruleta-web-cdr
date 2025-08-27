CREATE TABLE clientes (
    nit BIGINT PRIMARY KEY
);

CREATE TABLE pedidos (
    n_pedido BIGINT PRIMARY KEY,
    nit BIGINT NOT NULL,
    monto DECIMAL(15,2) NOT NULL,
    celular VARCHAR(15) NOT NULL,
    premio VARCHAR(50) NOT NULL,
    fecha DATETIME NOT NULL,
    FOREIGN KEY (nit) REFERENCES clientes(nit)
);