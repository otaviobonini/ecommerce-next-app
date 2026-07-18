"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAddress } from "../context/AddressContext";
import {
  faEdit,
  faTrash,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import AddressModal from "@/components/AddressModal";
import ErrorAlert from "@/components/ErrorAlert";
import { useState } from "react";

export default function AddressesPage() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editing, isEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();
  const { addresses, deleteAddress, setDefaultAddress, editAddress } =
    useAddress();

  async function handleDeleteAddress(addressId: number) {
    if (!token) return;
    setError(null);
    try {
      await deleteAddress(addressId, token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao remover endereço");
    }
  }

  async function handleSetDefault(addressId: number) {
    if (!token) return;
    setError(null);
    try {
      await setDefaultAddress(addressId, token);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erro ao definir endereço padrão",
      );
    }
  }

  function startEditing(address: {
    addressId: number;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }) {
    if (!token) return;
    setEditingAddressId(address.addressId);
    setEditForm({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });
    isEditing(true);
  }

  function cancelEditing() {
    isEditing(false);
    setEditingAddressId(null);
    setEditForm({ street: "", city: "", state: "", zipCode: "" });
  }

  function handleFieldChange(field: keyof typeof editForm, value: string) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveAddress(addressId: number) {
    if (
      !token ||
      !editForm.street.trim() ||
      !editForm.city.trim() ||
      !editForm.state.trim() ||
      !editForm.zipCode.trim()
    )
      return;
    setIsSaving(true);
    setError(null);
    try {
      await editAddress(addressId, { ...editForm }, token);
      cancelEditing();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar endereço");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="gap-4 p-4 ml-auto mr-auto lg:w-5xl  flex flex-col">
      <h1 className="text-3xl">Seus endereços</h1>{" "}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      <div className="flex flex-col gap-4">
        {addresses.map((address) => {
          const isThisEditing =
            editing && editingAddressId === address.addressId;
          return (
            <div
              className={`${address.isDefault ? "border-brand" : "border-gray-300"} relative rounded-xl max-w-72 md:max-w-5xl p-4 border`}
              key={address.addressId}
            >
              <div className="flex gap-2 items-center">
                <h1 className="font-semibold">
                  {isThisEditing ? (
                    <input
                      onChange={(e) =>
                        handleFieldChange("street", e.target.value)
                      }
                      value={editForm.street}
                      autoFocus
                      placeholder="Rua"
                      className="border border-gray-300 rounded px-2 py-1"
                    ></input>
                  ) : (
                    address.street
                  )}
                </h1>{" "}
                {address.isDefault ? (
                  <span className="bg-brand text-white rounded-2xl px-2">
                    Padrão
                  </span>
                ) : (
                  <button
                    className="bg-gray-500 rounded-2xl hover:cursor-pointer px-2 text-gray-200 hover:bg-gray-700 transition-colors"
                    onClick={() => handleSetDefault(address.addressId)}
                  >
                    Tornar padrão
                  </button>
                )}
              </div>
              {isThisEditing ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  <input
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    value={editForm.city}
                    placeholder="Cidade"
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                  ></input>
                  <input
                    onChange={(e) => handleFieldChange("state", e.target.value)}
                    value={editForm.state}
                    placeholder="Estado"
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                  ></input>
                  <input
                    onChange={(e) =>
                      handleFieldChange("zipCode", e.target.value)
                    }
                    value={editForm.zipCode}
                    placeholder="CEP"
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-28"
                  ></input>
                </div>
              ) : (
                <p className="text-sm text-gray-700">
                  {address.city} · {address.state} · {address.zipCode}
                </p>
              )}
              <div className="flex gap-2 items-center mt-2">
                {isThisEditing ? (
                  <>
                    <button
                      onClick={() => handleSaveAddress(address.addressId)}
                      disabled={isSaving}
                      aria-label="Salvar alteração"
                      className="flex items-center gap-1.5 px-1 py-1 rounded-md border border-green-200 bg-green-50 text-green-600 text-sm hover:bg-green-100 transition-colors cursor-pointer disabled:opacity-50 self-start"
                    >
                      <FontAwesomeIcon icon={faCheck} className="text-md" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={isSaving}
                      aria-label="Cancelar edição"
                      className="flex items-center gap-1.5 px-1 py-1 rounded-md border border-gray-200 bg-gray-50 text-gray-600 text-sm hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 self-start"
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-md" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleDeleteAddress(address.addressId)}
                      aria-label="Remover item"
                      className="flex items-center  top-2 right-4 sm:ml-0  gap-1.5 px-1 py-1 rounded-md border border-red-200 bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors cursor-pointer self-start"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-md" />
                    </button>

                    <button
                      onClick={() => startEditing(address)}
                      className="flex items-center  top-2 right-4 sm:ml-0  gap-1.5 px-1 py-1 rounded-md border border-brand/30 bg-brand/10 text-brand text-sm hover:bg-brand/20 transition-colors cursor-pointer self-start"
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-md" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div
        onClick={() => setIsAddressModalOpen(true)}
        className="flex justify-center items-center gap-2 mt-4 p-4 border h-20 max-w-72 md:max-w-5xl border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <div>+ Adicionar Endereço</div>
      </div>
      <AddressModal
        onSuccess={() => setIsAddressModalOpen(false)}
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      ></AddressModal>
    </div>
  );
}
