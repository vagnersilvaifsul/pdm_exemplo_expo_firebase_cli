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
const functions = require("firebase-functions");

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

/*
  Atenção: Esta função só funciona em Produção
  (por que o agendamento é feito pelo GCP).
  Segundo a documentação atual do Firebase,
  Cloud Pub/Sub não funciona no emulador local.
  Fonte: https://firebase.google.com/docs/emulator-suite?hl=pt-br
*/

// envia regularmente notificações para engajar na campanha "empresa"
exports.scheduledEmpresaNotification = functions.pubsub
    .schedule("every wednesday 18:15")
    .timeZone("America/Sao_Paulo")
    .onRun(async (context) => {
      const payload = {
        notification: {
          title: "Campanha empresa",
          body: "Teste de um schedule no Cloud Function para envio de notificações.",
        },
        data: {
          rota: "empresas",
        },
      };

      try {
        const response = await admin.messaging().sendToTopic("empresa", payload);
        console.log("Notification sent successfully:", response);
      } catch (error) {
        console.error("Notification sent failed:", error);
      }
      return null;
    });
