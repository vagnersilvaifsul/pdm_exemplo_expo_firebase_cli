/* eslint-disable max-len */
/* eslint-disable no-tabs */
/**
 * Crie e implante suas funções do Firebase: https://firebase.google.com/docs/functions
 *
 * Veja a lista completa de triggers suportadas em: https://firebase.google.com/docs/functions
 */

const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();
const messaging = admin.messaging();

// Exemplo de função para capturar uma trigger de um documento do Firestore
exports.onNotificacaoDemoTriggerV2 = onDocumentUpdated(
    {
      document: "notificacoesDemoTrigger/FuOfCVZF2Hol1HMcQZ27",
    },
    async (event) => {
      const beforeData =
			event.data && event.data.before ? event.data.before.data() : null;
      const afterData =
			event.data && event.data.after ? event.data.after.data() : null;
      console.log("Documento antes:", beforeData);
      console.log("Documento depois:", afterData);

      const payload = {
        notification: {
          title: "Alô, mundo!",
          body: "Teste do envio de notificações com FCM",
        },
        data: {
          rota: "empresas",
        },
        token:
				"O Token de acesso do app ao FCM - o Token que foi armazenado na coleção de usuários",
      };

      try {
        if (afterData.enviar === true) {
          const response = await messaging.send(payload);
          console.log("Notificação enviada com sucesso:", response);
        }
      } catch (error) {
        console.error("Envio da Notificação falhou:", error);
      }
      return null;
    },
);
