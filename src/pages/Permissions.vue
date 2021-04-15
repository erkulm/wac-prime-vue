<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedPermissions || !selectedPermissions.length" />
					</template>

					<template v-slot:right>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="permissions" v-model:selection="selectedPermissions" dataKey="id" :paginator="true" :rows="10" :filters="filters"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} permissions" responsiveLayout="scroll">
					<template #header>
						<div class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between">
							<h5 class="p-m-0">Manage Permissions</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column field="id" header="ID" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">ID</span>
							{{slotProps.data.id}}
						</template>
					</Column>
					<Column field="name" header="Name" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.name}}
						</template>
					</Column>
					<Column>
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editPermission(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeletePermission(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="permissionDialog" :style="{width: '450px'}" header="Permission Details" :modal="true" class="p-fluid">
					<div class="p-field">
						<label for="name">Name</label>
						<InputText id="name" v-model.trim="permission.name" required="true" autofocus :class="{'p-invalid': submitted && !permission.name}" />
						<small class="p-invalid" v-if="submitted && !permission.name">Name is required.</small>
					</div>

					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePermission" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deletePermissionDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="permission">Are you sure you want to delete <b>{{permission.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePermissionDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePermission" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deletePermissionsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="permission">Are you sure you want to delete the selected permissions?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePermissionsDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedPermissions" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import PermissionService from '../service/PermissionService';

export default {
	data() {
		return {
			permissions: null,
			permissionDialog: false,
			deletePermissionDialog: false,
			deletePermissionsDialog: false,
			permission: {},
			selectedPermissions: null,
			filters: {},
			submitted: false,
		}
	},
	permissionService: null,
	created() {
		this.permissionService = new PermissionService();
	},
	mounted() {
		this.permissionService.getPermissions().then(temp => this.permissions = temp);
		if(this.permissions == null){
			this.permissions = [];
		}
	},
	methods: {
		formatCurrency(value) {
			if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
			return;
		},
		openNew() {
			this.permission = {};
			this.submitted = false;
			this.permissionDialog = true;
		},
		hideDialog() {
			this.permissionDialog = false;
			this.submitted = false;
		},
		savePermission() {
			this.submitted = true;
			debugger;
			if (this.permission.name.trim()) {
			if (this.permission.id) {
				this.permission[this.findIndexById(this.permission.id)] = this.permission;
				this.$toast.add({severity:'success', summary: 'Successful', detail: 'Permission Updated', life: 3000});
				}
				else {
					this.permissionService.insertPermission(this.permission);
					this.permissions.push(this.permission);
					this.$toast.add({severity:'success', summary: 'Successful', detail: 'Permission Created', life: 3000});
				}
				this.permissionDialog = false;
				this.permission = {};
			}
		},
		editPermission(permission) {
			this.permission = {...permission};
			this.permissionDialog = true;
		},
		confirmDeletePermission(permission) {
			this.permission = permission;
			this.deletePermissionDialog = true;
		},
		deletePermission() {
			this.permissionService.deletePermission(this.permission);
			this.deletePermissionDialog = false;
			this.permissions = this.permissions.filter(val => val.id !== this.permission.id);
			this.permission = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Permission Deleted', life: 3000});
		},
		findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.permissions.length; i++) {
				if (this.permissions[i].id === id) {
					index = i;
					break;
				}
			}
			return index;
		},
		createId() {
			let id = '';
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for ( var i = 0; i < 5; i++ ) {
				id += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return id;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deletePermissionsDialog = true;
		},
		deleteSelectedPermissions() {
			this.permissions = this.permissions.filter(val => !this.selectedPermissions.includes(val));
			this.deletePermissionsDialog = false;
			this.selectedPermissions = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Permissions Deleted', life: 3000});
		}
	}
}
</script>

<style scoped lang="scss">
	.table-header {
		display: flex;
		justify-content: space-between;
	}

	.product-image {
		width: 100px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	}

	.p-dialog .product-image {
		width: 150px;
		margin: 0 auto 2rem auto;
		display: block;
	}

	.confirmation-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.product-badge {
		border-radius: 2px;
		padding: .25em .5rem;
		text-transform: uppercase;
		font-weight: 700;
		font-size: 12px;
		letter-spacing: .3px;

		&.status-instock {
			background: #C8E6C9;
			color: #256029;
		}

		&.status-outofstock {
			background: #FFCDD2;
			color: #C63737;
		}

		&.status-lowstock {
			background: #FEEDAF;
			color: #8A5340;
		}
	}

	::v-deep(.p-toolbar) {
		flex-wrap: wrap;
		.p-button {
			margin-bottom: .25rem;
		}
	}
</style>
