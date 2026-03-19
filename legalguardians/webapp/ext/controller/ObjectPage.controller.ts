import ControllerExtension from "sap/ui/core/mvc/ControllerExtension";
import ExtensionAPI from "sap/fe/templates/ObjectPage/ExtensionAPI";
import Dialog from "sap/m/Dialog";
import JSONModel from "sap/ui/model/json/JSONModel";
import View from "sap/ui/core/mvc/View";
import Fragment from "sap/ui/core/Fragment";
import Context from "sap/ui/model/odata/v4/Context";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import SinglePlanningCalendar, { SinglePlanningCalendar$AppointmentSelectEvent, SinglePlanningCalendar$AppointmentSelectEventParameters } from "sap/m/SinglePlanningCalendar";
import CalendarAppointment from "sap/ui/unified/CalendarAppointment";
import MessageBox from "sap/m/MessageBox";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";

/**
 * @namespace legalguardians.ext.controller
 * @controller
 */
export default class ObjectPage extends ControllerExtension<ExtensionAPI> {
	dialog: Dialog;
	static overrides = {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf legalguardians.ext.controller.ObjectPage
		 */
		onInit(this: ObjectPage) {
			// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
			const model = this.base.getExtensionAPI().getModel();
			console.log(model);
			this.formModel();
		}
	}

	/** Modelo del formulario alineado con scheduleAppointment */
	private formModel(): void {
		const data: {
			doctor: string;
			typeAppointment: string;
			title: string;
			description: string;
			beginDate: string | null;
			block: string;
		} = {
			doctor: "",
			typeAppointment: "",
			title: "",
			description: "",
			beginDate: null,
			block: ""
		};

		const model = new JSONModel(data);
		//@ts-ignore
		(this.base.getView() as View).setModel(model, "form");
	}

	/** Abrir diálogo */
	public async onOpenPress(): Promise<void> {
		//@ts-ignore
		const view = this.base.getView() as View;
		this.formModel();

		if (!this.dialog) {
			this.dialog = (await Fragment.load({
				id: view.getId(),
				name: "legalguardians.ext.fragment.Form",
				controller: this
			})) as Dialog;

			view.addDependent(this.dialog);
		}

		this.dialog.bindElement({
			path: "/",
			model: "form"
		});

		this.dialog.open();
	}

	/** Cerrar diálogo */
	public onClosePress(): void {
		if (this.dialog) {
			this.dialog.close();
		}
		this.formModel();
	}

	/** Guardar por action bound scheduleAppointment */
	public async onSavePress(): Promise<void> {

		try {
			//@ts-ignore
			const view = this.base.getView() as View;
			const form = view.getModel("form") as JSONModel;
			const data = form.getData();

			const oPatientContext = view.getBindingContext() as Context;
			if (!oPatientContext) {
				MessageBox.error("No existe contexto del paciente");
			}

			const oModel = oPatientContext.getModel() as ODataModel;

			const oOperation = oModel.bindContext("LogaliGroup.scheduleAppointment(...)",
				oPatientContext
			) as ODataContextBinding;

			oOperation.setParameter("doctor", data.doctor);
			oOperation.setParameter("typeAppointment", data.typeAppointment);
			oOperation.setParameter("title", data.title);
			oOperation.setParameter("description", data.description);
			oOperation.setParameter("beginDate", data.beginDate);
			oOperation.setParameter("block", data.block);

			await oOperation.execute();

			if (this.dialog) {
				this.dialog.close();
			}

			this.onClosePress();

			await oPatientContext.requestSideEffects([
				{ $NavigationPropertyPath: "toAppointments" }
			]);

			const planningCalendar = this.base.getExtensionAPI().byId("fe::CustomSubSection::PlanningCalendar--calendar") as SinglePlanningCalendar;

			const oBinding = planningCalendar.getBinding("appointments");
			oBinding?.refresh();

		} catch (error) {
			console.error("Error al agendar la cita:", error);
		}
	}
	/**Metodo navegar a la cita onNavAppointmentSelect */
	public async onNavAppointmentSelect(event: SinglePlanningCalendar$AppointmentSelectEvent): Promise<void> {
		const appointment = event.getParameter("appointment");
		const context = appointment?.getBindingContext() as Context;
		//@ts-ignore
		const ui = (this.base.getView() as View).getBindingContext() as Context;

		if (!context || !ui) {
			console.error("No hay contexto de cita o de paciente");
			return;
		}
        const isEditable = ui.getProperty("/isEditable") as boolean;
		// Appointment
		const sAppointmentID = await context.requestProperty("ID");
		// Patient
		const sPatientID = await ui.requestProperty("ID");

		// LegalGuardian: sacarlo del path padre actual
		const sPatientPath = ui.getPath();
		const aMatch = sPatientPath.match(
			/LegalGuardiansSet\(ID=([^,]+),IsActiveEntity=(true|false)\)/
		);

		if (!aMatch) {
			console.error("No se pudo obtener el ID del LegalGuardian desde el path:", sPatientPath);
			return;
		}

		const sLegalGuardianID = aMatch[1];
		//const bLegalGuardianActive = aMatch[2] === "true";

		this.base.getExtensionAPI().getRouting().navigateToRoute(
			"LegalGuardiansSet_toPatients_toAppointmentsObjectPage",
			{
				key: sLegalGuardianID,
				boolean: !isEditable,
				key2: sPatientID,
				boolean2: !isEditable,
				toAppointmentsKey: sAppointmentID,
				boolean3: !isEditable
			}
		);
	}
	/**Metodo eliminar cita */
	/*public async onAppointmentSelect(oEvent: any): Promise<void> {
		const oAppointment = oEvent.getParameter("appointment") as CalendarAppointment | null;

		if (!oAppointment) {
			return;
		}

		const oContext = oAppointment.getBindingContext() as Context | null;

		if (!oContext) {
			return;
		}

		MessageBox.confirm(
			"¿Querés eliminar esta cita?",
			{
				actions: ["Sí", "No"],
				onClose: async (sAction) => {
					if (sAction === "Sí") {
						try {
							await oContext.delete();

							// refrescar calendario
							const planningCalendar = this.base.getExtensionAPI().byId("fe::CustomSubSection::PlanningCalendar--calendar") as SinglePlanningCalendar;

							planningCalendar.getBinding("appointments")?.refresh();

						} catch (error) {
							console.error("Error al eliminar cita", error);
						}
					}
				}
			}
		);
	}*/
	/** Reset del formulario */
	private reset(): void {
		this.formModel();
	}
}