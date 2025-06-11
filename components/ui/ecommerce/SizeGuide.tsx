import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { SizeChart } from "@/lib/api/services/types";
interface SizeGuideProps {
  productId: number;
}

interface ChartData {
  /**
   * Label for the size row, e.g., "S", "M", "L", "XL"
   */
  label: string;
  values: {
    /**
     * Measurement type, e.g., "Chest", "Length", "Waist"
     */
    metric: string;
    /**
     * Value of the measurement, e.g., "33", "35", etc.
     */
    value: string;
    id?: string | null;
  }[];
  id?: string | null;
}

const SizeGuide = ({ productId }: SizeGuideProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = Dimensions.get("window");
  const [chartData, setChartData] = useState<ChartData[] | null>(null);
  const [allMetrics, setMetrics] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchSizeGuideData = async () => {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/size-chart/${productId}`
      );
      if (response.data && response.data.chart.length > 0) {
        const chartData = response.data.chart as ChartData[];
        const metricSet = new Set<string>();
        metricSet.add("Size")
        chartData.forEach((row) => {
          row.values.forEach((v) => metricSet.add(v.metric));
        });
        setChartData(chartData);
        setMetrics(Array.from(metricSet));
      }
    };
    fetchSizeGuideData();
  }, [productId]);

  return (
    <>
      {chartData !== null && (
        <TouchableOpacity
          style={styles.sizeGuideButton}
          onPress={() => setModalVisible(true)}
        >
          <ThemedText type="link">Size Guide</ThemedText>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: width - 32 }]}>
            <View style={styles.modalHeader}>
              {/* <ThemedText type="title">{sizeGuideData.title}</ThemedText> */}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                {allMetrics &&
                  allMetrics.map((metric) => (
                    <ThemedText
                      key={metric}
                      type="subtitle"
                      style={styles.headerCell}
                    >
                      {metric}
                    </ThemedText>
                  ))}
              </View>
              {chartData &&
                chartData.map((row, rowIndex) => (
                  <View
                    key={rowIndex}
                    style={[
                      styles.tableRow,
                      rowIndex % 2 === 0 && styles.evenRow,
                    ]}
                  >
                    <ThemedText style={styles.cell}>{row.label}</ThemedText>
                    {allMetrics &&
                      allMetrics.map((metric) => {
                        if(metric === "Size") return null;
                        const match = row.values.find(
                          (v) => v.metric === metric
                        );
                        return (
                          <ThemedText style={styles.cell}>
                            {match?.value ?? "--"}
                          </ThemedText>
                        );
                      })}
                  </View>
                ))}
            </View>

            <View style={styles.footer}>
              <ThemedText type="subtitle" style={styles.note}>
                All measurements are in inches
              </ThemedText>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  sizeGuideButton: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerCell: {
    flex: 1,
    padding: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  cell: {
    flex: 1,
    padding: 12,
    textAlign: "center",
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  note: {
    color: "#666",
  },
});

export default SizeGuide;
