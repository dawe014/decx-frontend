const BrandProfileDetails = ({
  brandData,
  isEditing,
  formData,
  setFormData,
}) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Company Details</h2>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-1">Company Size</label>
            <select
              value={formData.companySize}
              onChange={(e) =>
                setFormData({ ...formData, companySize: e.target.value })
              }
              className="w-full bg-slate-700 text-slate-100 rounded px-4 py-2"
            >
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-slate-700 text-slate-100 rounded px-4 py-2 min-h-[120px]"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">
              Contact Person
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.contactPerson?.name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactPerson: {
                      ...formData.contactPerson,
                      name: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-700 text-slate-100 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Position"
                value={formData.contactPerson?.position || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactPerson: {
                      ...formData.contactPerson,
                      position: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-700 text-slate-100 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.contactPerson?.phone || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactPerson: {
                      ...formData.contactPerson,
                      phone: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-700 text-slate-100 rounded px-4 py-2"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-slate-300">Company Size</p>
            <p className="text-white">
              {brandData.companySize
                ? `${brandData.companySize} employees`
                : "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-slate-300">Description</p>
            <p className="text-white">
              {brandData.description || "No description provided"}
            </p>
          </div>

          {brandData.contactPerson?.name && (
            <div>
              <h3 className="text-lg font-medium text-slate-200 mb-1">
                Contact Person
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-300">Name</p>
                  <p className="text-white">{brandData.contactPerson.name}</p>
                </div>
                <div>
                  <p className="text-slate-300">Position</p>
                  <p className="text-white">
                    {brandData.contactPerson.position || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-300">Phone</p>
                  <p className="text-white">
                    {brandData.contactPerson.phone || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandProfileDetails;
