
const passwordVerify = ({ value, passwordMinLength, passwordMaxLength, message, barWidth = 0, strongPass = false, msgUpdt = false }) => {

    if (value.length > 0) { 

        barWidth++;

        message = 'password.very-strong';
        strongPass = true;

        if (value.length < passwordMinLength && !value.includes(' ')) {
            if (!msgUpdt) {
                // message = t(`password.length.min.s`).replace('{}', passwordMinLength);
                message = 'password.length.min';
                msgUpdt = true;
            }
            strongPass = false;
        }
        else {

            barWidth++;

            // Validar se a senha possui caracteres repetidos ou em sequencia
            let hasSeq = false;
            value.split('').reduce((acc, char) => {

                acc.push(char.toLowerCase().charCodeAt());

                if (acc.length === 3) {
                    hasSeq = (acc[0] === (acc[1] - 1) && acc[1] === (acc[2] - 1)) ||
                        (acc[0] === (acc[1] + 1) && acc[1] === (acc[2] + 1)) ||
                        (acc[0] === (acc[1]) && acc[1] === (acc[2]));

                    acc.shift();
                }

                return acc;
            }, []);

            if (hasSeq || value.length < 12) {
                message = 'password.strong'; // Ao contrário das demais, esta mensagem pode ser subscrita, ela só será exibida se as demais validações forem válidas
                strongPass = true;
            }
            else barWidth++;

            if (value.includes(' ')) {
                if (!msgUpdt) {
                    message = 'password.weak.no-whitespace';
                    msgUpdt = true;
                }
                strongPass = false;
            }
            else barWidth++;

            // validar se a senha possui letras minúsculas
            if (!/(?=.*[a-z])/.test(value)) {
                if (!msgUpdt) {
                    message = 'password.weak.lowercase';
                    msgUpdt = true;
                }
                strongPass = false;
            }
            else barWidth++;

            // Validar se a senha possui letras maiúsculas
            if (!/(?=.*[A-Z])/.test(value)) {
                if (!msgUpdt) {
                    message = 'password.weak.uppercase';
                    msgUpdt = true;
                }
                strongPass = false;
            }
            else barWidth++;

            // Validar se a senha possui números
            if (!/(?=.*[0-9])/.test(value)) {
                if (!msgUpdt) {
                    message = 'password.weak.digits';
                    msgUpdt = true;
                }
                strongPass = false;
            }
            else barWidth++;

            // Validar se a senha possui caracteres especiais
            if (!/(?=.*[!@#$&%*_-])/.test(value)) {
                if (!msgUpdt) {
                    message = 'password.weak.symbols';
                    msgUpdt = true;
                }
                strongPass = false;
            }
            else barWidth++;

            if (value.length > passwordMaxLength) {
                if (!msgUpdt) {
                    // message = t(`password.length.max.s`).replace('{}', passwordMaxLength);
                    message = 'password.length.max';
                    msgUpdt = true;
                }
                strongPass = false;
            }
            else barWidth++;
        }

        barWidth++;
    }

    return { barWidth, strongPass, message };
};

export { passwordVerify };
