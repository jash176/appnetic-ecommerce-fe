import { StyleSheet, View } from "react-native";
import FormField from "./FormField";

export interface AddressFormData {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

const AddressForm = ({
  prefix,
  address,
  onChange
}: {
  prefix: string;
  address: AddressFormData;
  onChange: (field: string, value: string) => void;
}) => (
  <View>
    <FormField
      label="Full Name"
      value={address.name}
      onChange={(value) => onChange(`${prefix}.name`, value)}
      placeholder="John Doe"
      autoCapitalize="words"
    />

    <FormField
      label="Address Line 1"
      value={address.line1}
      onChange={(value) => onChange(`${prefix}.line1`, value)}
      placeholder="Street address, P.O. box"
      autoCapitalize="words"
    />

    <FormField
      label="Address Line 2 (Optional)"
      value={address.line2 || ''}
      onChange={(value) => onChange(`${prefix}.line2`, value)}
      placeholder="Apartment, suite, unit, building, floor, etc."
      autoCapitalize="words"
    />

    <View style={styles.rowFields}>
      <View style={styles.halfField}>
        <FormField
          label="City"
          value={address.city}
          onChange={(value) => onChange(`${prefix}.city`, value)}
          placeholder="City"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.halfField}>
        <FormField
          label="State"
          value={address.state}
          onChange={(value) => onChange(`${prefix}.state`, value)}
          placeholder="State"
          autoCapitalize="words"
        />
      </View>
    </View>

    <View style={styles.rowFields}>
      <View style={styles.halfField}>
        <FormField
          label="Postal Code"
          value={address.postalCode}
          onChange={(value) => onChange(`${prefix}.postalCode`, value)}
          placeholder="Postal Code"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.halfField}>
        <FormField
          label="Country"
          value={address.country}
          onChange={(value) => onChange(`${prefix}.country`, value)}
          placeholder="Country"
          autoCapitalize="words"
        />
      </View>
    </View>

    <FormField
      label="Phone"
      value={address.phone || ''}
      onChange={(value) => onChange(`${prefix}.phone`, value)}
      placeholder="Phone Number"
      keyboardType="phone-pad"
    />
  </View>
);

export default AddressForm;

const styles = StyleSheet.create({
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
  },
})
