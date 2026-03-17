import ControllerExtension from 'sap/ui/core/mvc/ControllerExtension';
import ExtensionAPI from 'sap/fe/templates/ObjectPage/ExtensionAPI';
import Dialog from 'sap/m/Dialog';
import JSONModel from 'sap/ui/model/json/JSONModel';
import View from 'sap/ui/core/mvc/View';
import Fragment from 'sap/ui/core/Fragment';
import { DatePicker$ChangeEvent } from 'sap/m/DatePicker';
import { ComboBox$ChangeEvent } from 'sap/m/ComboBox';
import ListItem from 'sap/ui/core/ListItem';
import Context from 'sap/ui/model/odata/v4/Context';
import SinglePlanningCalendar from 'sap/m/SinglePlanningCalendar';
import ODataListBinding from 'sap/ui/model/odata/v4/ODataListBinding';
import MessageBox from 'sap/m/MessageBox';
import MessageToast from 'sap/m/MessageToast';

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

	/**Metodo formModel */
	private formModel(): void {
		let data: {
			patient_ID: string,
			typeAppointment_ID: string,
			title: string,
			description: string,
			beginDate: Date | null,
			endDate: Date | null,
			startDate: string,
			endDate2: string,
			block_ID: string,
			beginTime: string,
			endTime: string
		} = {
			patient_ID: "",
			typeAppointment_ID: "",
			title: "",
			description: "",
			beginDate: null,
			endDate: null,
			startDate: "",
			endDate2: "",
			block_ID: "",
			beginTime: "",
			endTime: ""
		};
		const model = new JSONModel(data);
		// @ts-ignore
		this.base.getView().setModel(model, "form");
	}

	/**Metodo onOpenPress */
	public async onOpenPress(): Promise<void> {
		//@ts-ignore
		const view = this.base.getView() as View;
		this.formModel();
		this.dialog ??= await Fragment.load({
			id: view.getId(),
			name: "legalguardians.ext.fragment.Form",
			controller: this,
		}) as Dialog;

		view.addDependent(this.dialog);

		this.dialog.bindElement({
			path: '/',
			model: 'form'
		});

		this.dialog.open();
	}

	/**Metodo onClosePress */
	public onClosePress(): void {
		if (this.dialog) {
			this.dialog.close();
		}
		this.formModel();
	}

	/**Metodo onChangeDate */
	public onChangeDate(event: DatePicker$ChangeEvent): void {

		let sDate = event.getParameter("value") as string;
		//@ts-ignore
		let form = (this.base.getView() as View).getModel("form") as JSONModel;
		form.setProperty("/endDate", sDate)
		form.setProperty("/startDate", sDate);
		form.setProperty("/endDate2", sDate);
	}

	/**Metodo onChangeBlock*/
	public async onChangeBlock(event: ComboBox$ChangeEvent): Promise<void> {

		let item = event.getSource().getSelectedItem() as ListItem;
		let bindingContext = item.getBindingContext() as Context;
		let sBeginTime = await bindingContext.requestProperty("beginTime");
		let sEndTime = await bindingContext.requestProperty("endTime");
		//@ts-ignore
		let form = (this.base.getView() as View).getModel("form") as JSONModel;
		form.setProperty("/beginTime", sBeginTime);
		form.setProperty("/endTime", sEndTime);
		form.setProperty("/startDate", form.getProperty("/startDate") + "T" + sBeginTime);
		form.setProperty("/endDate2", form.getProperty("/endDate") + "T" + sEndTime)
	}

	/**Metodo onSavePress */
	public async onSavePress(): Promise<void> {
		//@ts-ignore
		let form = (this.base.getView() as View).getModel("form") as JSONModel;
		let body = form.getData();
		let planningCalendar = this.base.getExtensionAPI().byId("fe::CustomSubSection::PlanningCalendar--calendar") as SinglePlanningCalendar;
		let bindList = planningCalendar.getBinding("appointments") as ODataListBinding;

		//this.dialog.close();

		await bindList.create(body).created();
		this.reset();
	}
	/*public async onExitEdit(): Promise<void> {
		//@ts-ignore
		const oContext = (this.base.getView() as View).getBindingContext();

		try {
			await this.base.getExtensionAPI().getEditFlow().cancelDocument(oContext);
		} catch (error) {
			console.error("Error al salir de edición:", error);
		}
	}*/
	/*public async onSavePress(): Promise<void> {
		//@ts-ignore
		const view = this.base.getView() as View;
		const form = view.getModel("form") as JSONModel;
		const data = form.getData();

		const model = this.base.getExtensionAPI().getModel() as any;
		const oContext = view.getBindingContext() as Context;

		const body = {
			typeAppointment_ID: data.typeAppointment_ID,
			title: data.title,
			description: data.description,
			startDate: data.startDate,
			endDate2: data.endDate2,
			block_ID: data.block_ID
		};

		try {
			this.dialog.setBusy(true);

			const listBinding = model.bindList(
				"toAppointments",
				oContext,
				undefined,
				undefined,
				{ $$updateGroupId: "$auto" }
			) as ODataListBinding;

			const onCreateCompleted = (oEvent: any) => {
				const success = oEvent.getParameter("success");

				listBinding.detachCreateCompleted(onCreateCompleted);
				this.dialog.setBusy(false);

				if (success) {
					const planningCalendar = this.base.getExtensionAPI().byId(
						"fe::CustomSubSection::PlanningCalendar--calendar"
					) as SinglePlanningCalendar;

					planningCalendar.getBinding("appointments")?.refresh();
					this.dialog.close();
					this.formModel();
					MessageToast.show("Cita creada correctamente");
				} else {
					MessageBox.error(
						"No se pudo crear la cita. El servicio OData rechazó la operación de alta en modo draft."
					);
				}
			};

			listBinding.attachCreateCompleted(onCreateCompleted);
			listBinding.create(body);
			await model.submitBatch("$auto");
		} catch (error) {
			this.dialog.setBusy(false);
			console.error("Error al crear cita:", error);
			MessageBox.error("No se pudo crear la cita.");
		}
	}*/
	/*public async onSavePress(): Promise<void> {
		//@ts-ignore
		let view = this.base.getView() as View;
		let form = view.getModel("form") as JSONModel;
		let body = form.getData();

		let planningCalendar = this.base.getExtensionAPI().byId(
			"fe::CustomSubSection::PlanningCalendar--calendar"
		) as SinglePlanningCalendar;

		let bindList = planningCalendar.getBinding("appointments") as ODataListBinding;

		this.dialog.close();
		console.log(body);

		await bindList.create(body).created();

		console.log("Cita agregada al calendar", bindList);

		this.onClosePress();
		this.reset();

		const oContext = view.getBindingContext() as Context;
		await this.base.getExtensionAPI().getEditFlow().cancelDocument(oContext, {
			skipDiscardPopover: true
		});
	}
	public async onExitEdit(): Promise<void> {
		//@ts-ignore
		const oContext = (this.base.getView() as View).getBindingContext() as Context;

		try {
			await this.base.getExtensionAPI().getEditFlow().cancelDocument(oContext, {
				skipDiscardPopover: true
			});
		} catch (error) {
			console.error("Error al salir de edición:", error);
		}
	}*/

	/**Metodo reset */
	private reset(): void {
		this.formModel();
	}

}