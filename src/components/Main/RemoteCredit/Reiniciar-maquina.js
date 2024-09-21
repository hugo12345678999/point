import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "antd";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";

const Reiniciar = () => {
    const { id } = useParams();
    const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);
    const token = authInfo?.dataUser?.token;
    const [isLoading, setIsLoading] = useState(false);

    const onSave = () => {
        setIsLoading(true);
        axios.post(`${process.env.REACT_APP_SERVIDOR}/credito-remoto-cliente`, {
            id: id,
            valor: '4002',
        }, {
            headers: {
                "x-access-token": token,
                "content-type": "application/json",
            }
        })
        .then(() => {
            setIsLoading(false);
            setNotiMessage({
                type: 'success',
                message: 'CONFIGURANDO GARRA FRACA! AGUARDE O VALOR SER MODIFICADO PARA CONFIGURAR OUTRA FUNÇÃO!'
            });
        })
        .catch(err => {
            setIsLoading(false);
            if ([401, 403].includes(err.response?.status)) {
                setNotiMessage({
                    type: 'error',
                    message: 'A sua sessão expirou, para continuar faça login novamente.'
                });
                setDataUser(null);
            } else {
                setNotiMessage({
                    type: 'error',
                    message: `Erro, algo deu errado ${err.response?.data?.msg}`
                });
            }
        });
    };

    return (
        <>
            {isLoading && <LoadingAction />}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button 
                    onClick={onSave} 
                    disabled={isLoading} 
                    style={{ backgroundColor: "yellow", color: "black" }} // Botão amarelo com texto preto
                >
                    REINICIAR
                </Button>
            </div>
        </>
    );
}

export default Reiniciar;
